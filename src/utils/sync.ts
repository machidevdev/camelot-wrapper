import { mirrorPoolType, mirrorResponseType, mirrorSchema } from "../schemas/mirrorPoolSchema";
import { nitroPoolType, nitroResponseType, nitroSchema } from "../schemas/nitroPoolSchema";
import fetchAndValidate from "../validations/fetchAndValidate";
import { Pool, poolModel } from "../schemas/poolSchema";
import { addPoolToDB, updatePoolInDB } from "./utils";
import { delay } from "./utils";
import { connect } from "../connection";
import { config } from "../config";

export const syncData = async (): Promise<boolean> => {
    await connect();
    try {
        const currentPools = await poolModel.find({});
        const mirrorData = await fetchAndValidate(config.mirrorEndpoint, mirrorSchema)
        const nitroData = await fetchAndValidate(config.nitroEndpoint, nitroSchema)

        const pools = filterPools(mirrorData);
        const nitros = filterNitros(nitroData);

        mergePoolsAndNitros(pools, nitros);

        await processPools(pools, currentPools);
        await deleteInactivePools(pools, currentPools);

        return true;
    } catch (error) {
        console.error("Error in syncData function: ", error);
        return false;
    }
};

function filterPools(mirrorData: mirrorResponseType): mirrorPoolType[] {
    return Object.values(mirrorData.data.nftPools).filter(pool => 
        pool.tvlUSD > 0 && pool.isFarm && Number(pool.poolEmissionRate) > 0);
}

function filterNitros(nitroData: nitroResponseType): nitroPoolType[] {
    return Object.values(nitroData.data.nitros).filter(nitro => 
        nitro.whitelistLength == 0 && Number(nitro.rewardsToken1PerSecond) > 0 && nitro.endTime * 1000 > Date.now());
}

function mergePoolsAndNitros(pools: mirrorPoolType[], nitros: nitroPoolType[]): void {
    nitros.forEach(nitro => {
        const pool = pools.find(pool => pool.address === nitro.nftPool);
        if (pool) {
            pool.nitro = nitro;
        }
    });
}

async function processPools(pools: mirrorPoolType[], currentPools: Pool[]): Promise<void> {
    for (let i = 0; i < pools.length; i++) {
        try {
            console.log(`Processing pool ${i + 1}/${pools.length}`);
            const existingPool = currentPools.find(pool => pool.address === pools[i].address);
            if (existingPool) {
                await updatePoolInDB(pools[i]);
            } else {
                await addPoolToDB(pools[i]);
            }
        } catch (error) {
            console.error(`Error processing pool ${pools[i].depositToken}: ${error}`);
        }
        await delay(1000);
    }
}

async function deleteInactivePools(pools: mirrorPoolType[], currentPools: Pool[]): Promise<void> {
    const activePoolAddresses = pools.map(pool => pool.address);
    const poolsToDelete = currentPools.filter(pool => !activePoolAddresses.includes(pool.address));
    console.log(`Deprecated pools: ${poolsToDelete.map(pool => pool.address)}`);
    await poolModel.deleteMany({ address: { $in: poolsToDelete.map(pool => pool.address) } });
}

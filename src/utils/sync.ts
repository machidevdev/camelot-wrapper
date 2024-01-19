import { mirrorPoolType, mirrorResponseType, mirrorSchema } from "../schemas/mirrorPoolSchema";
import { nitroPoolType, nitroResponseType, nitroSchema } from "../schemas/nitroPoolSchema";
import fetchAndValidate from "../validations/fetchAndValidate";
import { Pool, poolModel } from "../schemas/poolSchema";
import { addPoolToDB, updatePoolInDB } from "./utils";
import { delay } from "./utils";
import { connect } from "../connection";
import { config } from "../config";
import { supportedLpResponseSchema, supportedLpResponseType, supportedLpType } from "../schemas/supportedLpResponseSchema";

const dead = "0x0000000000000000000000000000000000000000";

/**
 * Synchronizes data by fetching and processing pools and nitros.
 * @returns A promise that resolves to a boolean indicating whether the synchronization was successful.
 * Note: this function should be called periodically to keep the database up to date.
 */
export const syncData = async (): Promise<boolean> => {
  await connect();
  try {
    const currentPools = await poolModel.find({});
    const [mirrorData, nitroData] = await Promise.all([
      fetchAndValidate(config.mirrorEndpoint, mirrorSchema),
      fetchAndValidate(config.nitroEndpoint, nitroSchema)
    ]);

    //TODO: REWRITE THIS IN A BETTER WAY
    const supportedLpsRequest = await fetch("http://108.61.189.22:8000/subgraphs/name/isekia/all",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query Lps{
            supportedLps {
              lp
              nitroPool
              spNft
            }
          }
          `
        })
      }
    )
    
    const supportedLpResponse = supportedLpResponseSchema.parse(await supportedLpsRequest.json());

    const supportedLps = supportedLpResponse.data.supportedLps;
    
    const pools = filterPools(mirrorData, supportedLps);
    console.log(pools)
    const nitros = filterNitros(nitroData,supportedLps);

    
    mergePoolsAndNitros(pools, nitros);
    console.log(pools)

    await processPools(pools, currentPools);
    await deleteInactivePools(pools, currentPools);

    return true;
  } catch (error) {
    console.error("Error in syncData function: ", error);
    return false;
  }
};


//We're also filtering pools not in the supportedLps list
function filterPools(mirrorData: mirrorResponseType, supportedLps: supportedLpType[]): mirrorPoolType[] {

  const supported: mirrorPoolType[] = []
  

  Object.keys(mirrorData.data.nftPools).forEach(key => {
    if(supportedLps.find(lp => lp.spNft.toLowerCase() === key.toLowerCase())){
      supported.push(mirrorData.data.nftPools[key])
    }
  })
  return supported  
}

function filterNitros(nitroData: nitroResponseType, supportedNitro: supportedLpType[]): nitroPoolType[] {
  return []
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
        console.log(`Updating pool ${pools[i].depositToken}`);
        await updatePoolInDB(pools[i]);
      } else {
        console.log(`Adding pool ${pools[i].depositToken}`);
        await addPoolToDB(pools[i]);
      }
    } catch (error) {
      console.error(`Error processing pool ${pools[i].depositToken}: ${error}`);
    }
  }
}

async function deleteInactivePools(pools: mirrorPoolType[], currentPools: Pool[]): Promise<void> {
  const activePoolAddresses = pools.map(pool => pool.address);
  const poolsToDelete = currentPools.filter(pool => !activePoolAddresses.includes(pool.address));
  console.log(`Deprecated pools: ${poolsToDelete.map(pool => pool.address)}`);
  await poolModel.deleteMany({ address: { $in: poolsToDelete.map(pool => pool.address) } });
}


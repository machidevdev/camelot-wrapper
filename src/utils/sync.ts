import { mirrorSchema } from "../schemas/mirrorPoolSchema"
import { nitroSchema } from "../schemas/nitroPoolSchema"
import fetchAndValidate from "../validations/fetchAndValidate"
import { poolModel } from "../schemas/poolSchema"
import { addPoolToDB, updatePoolInDB } from "./utils"
import { delay } from "./utils"
import { connect } from "../connection"
import { config } from "../config"

export const syncData = async (): Promise<boolean> => {
  //get data from endpoints; look for new pools and update existing pools, delete old ones if necessary.
  await connect()
  try {



    const currentPools = await poolModel.find({})

    const mirrorData = await fetchAndValidate(config.mirrorEndpoint, mirrorSchema)
    const nitroData = await fetchAndValidate(config.nitroEndpoint, nitroSchema)

    //filter out pools with no tvl, no emission rate, or not a farm
    const pools = Object.values(mirrorData.data.nftPools).filter(pool => pool.tvlUSD > 0 && pool.isFarm && Number(pool.poolEmissionRate) > 0);

    //filter out nitros with no rewards, no whitelist, or expired
    const nitros = Object.values(nitroData.data.nitros).filter(nitro => nitro.whitelistLength == 0 && Number(nitro.rewardsToken1PerSecond) > 0 && nitro.endTime * 1000 > Date.now());



    for (let i = 0; i < nitros.length; i++) {
      const pool = pools.find(pool => pool.address == nitros[i].nftPool);
      if (pool) {
        pool.nitro = nitros[i]
      }
    }

    //add new pools to db
    for (let i = 0; i < pools.length; i++) {
      try {
        //pool#/totalpools
        console.log(`Processing pool ${i + 1}/${pools.length}`);
        if (currentPools.find(pool => pool.address == pools[i].address)) {
          //if pool already exists, update it
          await updatePoolInDB(pools[i]);
        }
        else {
          //if pool doesn't exist, add it
          await addPoolToDB(pools[i]);

        }
      } catch (error) {
        console.error(`Error processing pool ${pools[i].depositToken}: ${error}`);
      }
      await delay(1000);
    }

    //delete pools that are no longer active
    const activePools = pools.map(pool => pool.address)
    const deletedPools = currentPools.filter(pool => !activePools.includes(pool.address))
    //log deprecated pools: 
    console.log(`Deprecated pools: ${deletedPools.map(pool => pool.address)}`)
    await poolModel.deleteMany({ address: { $in: deletedPools } })
    return true;




  } catch (error) {
    console.error("Error in syncData function: ", error);
    return false;
  }



}
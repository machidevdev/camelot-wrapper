import Pool from "./db/nftPool";
import { NFTPools, NftPool, NitroPool, NitroPools } from "./types"
import { calculateAPR, calculateNitroApr } from "./utils/apr";
import { delay, fetchLPData, fetchNitroTokenData, fetchTokenSymbols, } from "./utils/utils";
const CAMELOT_NFT_URL = "https://api.camelot.exchange/v2/nft-pools";
const CAMELOT_NITRO_URL= "https://api.camelot.exchange/v2/nitro-pools-data";










async function addPoolToDB(pool: NftPool) {
  //check if pool has nitro first of all. if it does, calculate min-max base apr and nitro aprs. if not, only base apr
  //also get all token symbols needed for pool
  let nitroAPR = 0;
  const { baseAPR, maxAPR } = await calculateAPR(pool);
  const lpData = await fetchLPData(pool.depositToken);
  let nitroTokenData:any = []
  if(pool.nitro){
    nitroAPR = await calculateNitroApr(pool.nitro);
    nitroTokenData = await fetchNitroTokenData(pool.nitro);
    
  }
  const p = new Pool({
    name: lpData ? lpData[0].symbol + "-" + lpData[1].symbol : "Unknown",
    address: pool.address,
    isNitro: pool.nitro ? true : false,
    depositToken: pool.depositToken,
    minAPR: baseAPR,
    maxAPR: maxAPR,
    nitroAPR: nitroAPR,
    lpTokens: lpData,
    nitroTokens: nitroTokenData,
    tvlUSD: 0
  })
  await p.save()
  console.log(`Added ${pool.depositToken} to db`)

}

export default async function setup() {
    console.log("Setting up db list...");
    const nftPool = await fetch(CAMELOT_NFT_URL);
    const nitroPool = await fetch(CAMELOT_NITRO_URL);
    const poolsData = await nftPool.json() as NFTPools;
    const nitroData = await nitroPool.json() as NitroPools;



    const pools = Object.values(poolsData.data.nftPools).filter(pool => pool.tvlUSD > 0 && pool.isFarm && pool.poolEmissionRate > 0);
    const nitros = Object.values(nitroData.data.nitros).filter(nitro => nitro.whitelistLength == 0 && Number(nitro.rewardsToken1PerSecond) > 0 && nitro.endTime * 1000 > Date.now());


    //merge pools and nitros if nitros[pool].nftPool = pool.address
    for (let i = 0; i < nitros.length; i++) {
      const pool = pools.find(pool => pool.address == nitros[i].nftPool)
      if (pool) {
        pool.nitro = nitros[i]
      }
    }

    

    for (let i = 0; i < pools.length; i++) {
      try {
        //pool#/totalpools
        console.log(`Processing pool ${i + 1}/${pools.length}`);
        await addPoolToDB(pools[i]);
      } catch (error) {
        console.error(`Error processing pool ${pools[i].depositToken}: ${error}`);
      }
      await delay(1000);
    }
    console.log("All pools have been processed.");
  }

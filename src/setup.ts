import { NFTPools, NftPool, tokenSymbolsType } from "./types"
import { calculateAPR, fetchTokenSymbols } from "./utils";
const CAMELOT_API_URL = "https://api.camelot.exchange/v2/nft-pools";











async function addPoolToDB(pool: NftPool, index: number, length: number) {
  console.log(`[${index}/${length}]: adding pool: ${pool.depositToken}`);
  const tokenSymbolsData = await fetchTokenSymbols(pool.depositToken);
  if (tokenSymbolsData) {
    const apr = await calculateAPR(pool);
    console.log(`APR for ${pool.address}: ${apr}`)
    // The rest of the logic to add the pool to the database goes here.
    // ...
    // Don't forget to handle any errors or exceptions.
  }
}

export default async function setup() {
    console.log("Setting up db list...");
    const response = await fetch(CAMELOT_API_URL);
    if (!response.ok) {
      throw new Error(`Error fetching pools: ${response.status}`);
    }
    const poolsData = (await response.json()) as NFTPools;
    const pools = Object.values(poolsData.data.nftPools).filter(pool => pool.tvlUSD > 0 && pool.isFarm);
  
    for (let i = 0; i < pools.length; i++) {
      try {
        await addPoolToDB(pools[i], i + 1, pools.length);
      } catch (error) {
        console.error(`Error processing pool ${pools[i].depositToken}: ${error}`);
      }
    }
    console.log("All pools have been processed.");
  }

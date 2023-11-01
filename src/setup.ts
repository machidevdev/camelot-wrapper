import { NFTPools, NftPool, tokenSymbolsType } from "./types"
import Pool from "./db/nftPool"



function createGraphQlCall(address: string) {
    return `query TokenQuery{
        pair(id: "${address}") {
          id
            token0 {
              name
            }
            token1 {
              name
            }
        }
      }`
}


export default async function setup() {
    //queue to fetch token symbols from camelot graphql api and add them to the db with pool info
    console.log("setting up db list...")
    //add all tokens to the db
    const nftPools = await fetch("https://api.camelot.exchange/v2/nft-pools")
    const poolsData = await nftPools.json() as NFTPools

    const length = Object.values(poolsData.data.nftPools).length
    Object.values(poolsData.data.nftPools).forEach(async (pool: NftPool, index) => {
            setTimeout(async () => {
                if(pool.tvlUSD > 0 && pool.isFarm){
                    console.log(`[${index}/${length}]: adding pool: ${pool.depositToken}`)
                    const grahqplCall = createGraphQlCall(pool.depositToken.toLowerCase())
    
                    const tokenSymbols = await fetch("https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ query: grahqplCall })
                    })
                    const tokenSymbolsData = await tokenSymbols.json() as tokenSymbolsType
                    const newPool = new Pool({
                        poolEmissionRate: pool.poolEmissionRate,
                        isFarm: pool.isFarm,
                        totalDeposit: pool.totalDeposit,
                        allocPoint: pool.allocPoint,
                        totalDepositWithMultiplier: pool.totalDepositWithMultiplier,
                        maxGlobalMultiplier: pool.maxGlobalMultiplier,
                        maxLockDuration: pool.maxLockDuration,
                        maxLockMultiplier: pool.maxLockMultiplier,
                        maxBoostMultiplier: pool.maxBoostMultiplier,
                        xGrailRewardsShare: pool.xGrailRewardsShare,
                        totalBoostAllocated: pool.totalBoostAllocated,
                        address: pool.address,
                        depositToken: pool.depositToken,
                        emergencyUnlock: pool.emergencyUnlock,
                        tvlUSD: pool.tvlUSD,
                        minIncentivesApr: pool.minIncentivesApr,
                        maxIncentivesApr: pool.maxIncentivesApr,
                        name: tokenSymbolsData.data.pair.token0.name + "/" + tokenSymbolsData.data.pair.token1.name
                    })
                    await newPool.save()
                    console.log(`[${index}/${length}]: saved pool: ${tokenSymbolsData.data.pair.token0.name + "/" + tokenSymbolsData.data.pair.token1.name}`)
                }
                else{
                    console.log("skipping pool: " + pool.depositToken)
                }
                
            }, index * 2000); //index * 2000 to avoid possible rate limiting
    })

}
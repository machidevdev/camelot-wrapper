import { NFTPools, NftPool } from "./src/types"
import mongoose from "mongoose"
import Pool from "./src/db/nftPool"
export default async function update() {
    const nftPools = await fetch("https://api.camelot.exchange/v2/nft-pools")
    const poolsData = await nftPools.json() as NFTPools

    //update time-changing values(apr, totalDeposit, etc)
    Object.values(poolsData.data.nftPools).forEach((pool: NftPool) => {
      
    })
}
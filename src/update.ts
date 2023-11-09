import mongoose from "mongoose"
import { NFTPools, NftPool } from "./types"
import Pool from "./db/nftPool"
export default async function update() {
    const nftPools = await fetch("https://api.camelot.exchange/v2/nft-pools")
    const poolsData = await nftPools.json() as NFTPools

    //filter pools using isfarm active and tvl > 0
    //update time-changing values(apr, totalDeposit, etc)
    //update db

    const filtered = Object.values(poolsData.data.nftPools).filter(pool => pool.tvlUSD > 0 && pool.isFarm)
    const currentPools = await Pool.find({})
    //find new pools from the filtered
    const newPools = filtered.filter(pool => currentPools.find(p => p.address == pool.address) == null)
    //find removed pools from the current. remember to not remove these pools from the db istantly, but to set a flag to remove them after a week or so
    const removedPools = currentPools.filter(pool => filtered.find(p => p.address == pool.address) == null)
    //update existing pools
    console.log("updating existing pools...")

}
import mongoose from "mongoose"
import { mirrorSchema } from "./schemas/mirrorPoolSchema"
import Pool from "./db/nftPool"
import fetchAndValidate from "./validations/fetchAndValidate"



export default async function update() {
    try{
        const mirrorPools = await fetchAndValidate(process.env.MIRROR_ENDPOINT || "", mirrorSchema)
        return mirrorPools
    }catch(e){
        throw e;
    }
    
}
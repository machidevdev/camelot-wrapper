import mongoose from "mongoose";
import {z} from "zod"

const mongooseTokenSchema = new mongoose.Schema({
    symbol:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true
    },
    tvlUSD:{
        type: Number,
        required: true
    },
    volumeUSD:{
        type: Number,
        required: true
    },
    
})


const tokenSchema = z.object({
    symbol: z.string(),
    name: z.string(),
    address: z.string(),
    price: z.number(),
    tvlUSD: z.number(),
    volumeUSD: z.number(),

})

type tokenType = z.infer<typeof tokenSchema>

const tokenModel = mongoose.model("Token", mongooseTokenSchema);

export {tokenModel, tokenSchema, tokenType}
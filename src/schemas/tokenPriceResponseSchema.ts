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
    decimals: z.string(),
    price: z.number(),
    volumeUSD: z.number(),
    tvlUSD: z.number(),
    address: z.string(),
});


const tokensSchema = z.record(tokenSchema);

const dataSchema = z.object({
    lastSync: z.number(),
    tokens: tokensSchema,
});

const tokenPriceResponseSchema = z.object({
    data: dataSchema,
});

// Type for the API response
type ApiResponse = z.infer<typeof tokenPriceResponseSchema>;
type tokenPriceType = z.infer<typeof tokenSchema>;

export { tokenPriceResponseSchema, ApiResponse, mongooseTokenSchema, tokenPriceType };

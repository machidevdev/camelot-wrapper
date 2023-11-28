import mongoose from "mongoose";
import { z } from "zod"

const mongooseTokenSchema = new mongoose.Schema({
    symbol: {
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
    price: {
        type: Number,
        required: true
    },
    tvlUSD: {
        type: Number,
        required: true
    },
    volumeUSD: {
        type: Number,
        required: true
    },

})



const tokenSchema = z.object({
    symbol: z.string(),
    name: z.string(),
    decimals: z.union([z.number(), z.string()]),
    price: z.number(),
    volumeUSD: z.union([z.number(), z.string()]),
    tvlUSD: z.union([z.number(), z.string()]),
    address: z.string(),
}).transform((data) => {
    return {
        ...data,
        volumeUSD: Number(data.volumeUSD),
        tvlUSD: Number(data.tvlUSD),
        decimals: Number(data.decimals),
    }
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

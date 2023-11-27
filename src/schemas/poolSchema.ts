import { z } from 'zod';
import mongoose from 'mongoose';
// Zod schema for the token
const tokenSchema = z.object({
  symbol: z.string(),
  address: z.string(),
  image: z.string()
});

// Zod schema for the pool
const poolSchema = z.object({
  name: z.string(),
  address: z.string(),
  isNitro: z.boolean(),
  depositToken: z.string(),
  minAPR: z.number(),
  maxAPR: z.number(),
  tvlUSD: z.number(),
  nitroAPR: z.number(),
  lpTokens: z.array(tokenSchema),
  nitroTokens: z.array(tokenSchema)
});

const mongooseTokenSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true }
  });

const mongoosePoolSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    isNitro: {
        type:Boolean,
        required:true
    },
    depositToken:{
        type:String,
        required:true,
    },
    minAPR:{
        type:Number,
        required:true
    },
    maxAPR:{
        type:Number,
        required:true
    },
    tvlUSD:{
        type:Number,
        required:true
    },
    nitroAPR:{
        type:Number,
        required:true
    },
    bonusShare: {
        type:Number,
        required:true
    },
    lpTokens: [mongooseTokenSchema],
    nitroTokens: [mongooseTokenSchema]
})


const poolModel = mongoose.model("NftPool", mongoosePoolSchema);

// Types for TypeScript inference, if needed
type Token = z.infer<typeof tokenSchema>;
type Pool = z.infer<typeof poolSchema>;

export { tokenSchema, poolSchema, Token, Pool, poolModel};

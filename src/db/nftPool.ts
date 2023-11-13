import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true }
  });

const poolSchema = new mongoose.Schema({

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
    lpTokens: [tokenSchema],
    nitroTokens: [tokenSchema]
})


const Pool = mongoose.model("NftPool", poolSchema);
export default Pool;
import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
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


const Token = mongoose.model("Token", tokenSchema);
export default Token;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var tokenSchema = new mongoose_1.default.Schema({
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
});
var Token = mongoose_1.default.model("Token", tokenSchema);
exports.default = Token;

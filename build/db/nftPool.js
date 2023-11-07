"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
/**
 * {"0x6BC938abA940fB828D39Daa23A94dfc522120C11":
 * {"poolEmissionRate":"4607416694528",
 * isFarm":true,
 * "totalDeposit":"12318467405278210",
 * "allocPoint":420,
 * "totalDepositWithMultiplier":"14796104585503155",
 * "maxGlobalMultiplier":200,
 * "maxLockDuration":15811200,
 * "maxLockMultiplier":70,
 * "maxBoostMultiplier":100,
 * "xGrailRewardsShare":8000,
 * "totalBoostAllocated":"29902480364065454589",
 * "address":"0x6BC938abA940fB828D39Daa23A94dfc522120C11",
 * "depositToken":"0x84652bb2539513BAf36e225c930Fdd8eaa63CE27",
 * "emergencyUnlock":false,
 * "tvlUSD":1152307.420592124,
 * "minIncentivesApr":8.34410314562633,
 * "maxIncentivesApr":25.032309436878986}
 */
var poolSchema = new mongoose_1.default.Schema({
    poolEmissionRate: {
        type: String,
        required: true,
    },
    totalDeposit: {
        type: String,
        required: true
    },
    allocPoint: {
        type: Number,
        required: true
    },
    totalDepositWithMultiplier: {
        type: String,
        required: true
    },
    maxGlobalMultiplier: {
        type: Number,
        required: true
    },
    maxLockDuration: {
        type: Number,
        required: true
    },
    maxLockMultiplier: {
        type: Number,
        required: true
    },
    maxBoostMultiplier: {
        type: Number,
        required: true
    },
    xGrailRewardsShare: {
        type: Number,
        required: true
    },
    totalBoostAllocated: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    depositToken: {
        type: String,
        required: true
    },
    tvlUSD: {
        type: Number,
        required: true
    },
    minIncentivesApr: {
        type: Number,
        required: true
    },
    maxIncentivesApr: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        index: true
    },
});
var Pool = mongoose_1.default.model("NftPool", poolSchema);
exports.default = Pool;

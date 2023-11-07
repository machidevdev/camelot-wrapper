"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nftPool_1 = __importDefault(require("./db/nftPool"));
function createGraphQlCall(address) {
    return "query TokenQuery{\n        pair(id: \"".concat(address, "\") {\n          id\n            token0 {\n              name\n            }\n            token1 {\n              name\n            }\n        }\n      }");
}
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var nftPools, poolsData, length;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //queue to fetch token symbols from camelot graphql api and add them to the db with pool info
                    console.log("setting up db list...");
                    return [4 /*yield*/, fetch("https://api.camelot.exchange/v2/nft-pools")];
                case 1:
                    nftPools = _a.sent();
                    return [4 /*yield*/, nftPools.json()];
                case 2:
                    poolsData = _a.sent();
                    length = Object.values(poolsData.data.nftPools).length;
                    Object.values(poolsData.data.nftPools).forEach(function (pool, index) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var grahqplCall, tokenSymbols, tokenSymbolsData, newPool;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(pool.tvlUSD > 0 && pool.isFarm)) return [3 /*break*/, 4];
                                            console.log("[".concat(index, "/").concat(length, "]: adding pool: ").concat(pool.depositToken));
                                            grahqplCall = createGraphQlCall(pool.depositToken.toLowerCase());
                                            return [4 /*yield*/, fetch("https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm", {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ query: grahqplCall })
                                                })];
                                        case 1:
                                            tokenSymbols = _a.sent();
                                            return [4 /*yield*/, tokenSymbols.json()];
                                        case 2:
                                            tokenSymbolsData = _a.sent();
                                            newPool = new nftPool_1.default({
                                                poolEmissionRate: pool.poolEmissionRate,
                                                isFarm: pool.isFarm,
                                                totalDeposit: pool.totalDeposit,
                                                allocPoint: pool.allocPoint,
                                                totalDepositWithMultiplier: pool.totalDepositWithMultiplier,
                                                maxGlobalMultiplier: pool.maxGlobalMultiplier,
                                                maxLockDuration: pool.maxLockDuration,
                                                maxLockMultiplier: pool.maxLockMultiplier,
                                                maxBoostMultiplier: pool.maxBoostMultiplier,
                                                xGrailRewardsShare: pool.xGrailRewardsShare,
                                                totalBoostAllocated: pool.totalBoostAllocated,
                                                address: pool.address,
                                                depositToken: pool.depositToken,
                                                emergencyUnlock: pool.emergencyUnlock,
                                                tvlUSD: pool.tvlUSD,
                                                minIncentivesApr: pool.minIncentivesApr,
                                                maxIncentivesApr: pool.maxIncentivesApr,
                                                name: tokenSymbolsData.data.pair.token0.name + "/" + tokenSymbolsData.data.pair.token1.name
                                            });
                                            return [4 /*yield*/, newPool.save()];
                                        case 3:
                                            _a.sent();
                                            console.log("[".concat(index, "/").concat(length, "]: saved pool: ").concat(tokenSymbolsData.data.pair.token0.name + "/" + tokenSymbolsData.data.pair.token1.name));
                                            return [3 /*break*/, 5];
                                        case 4:
                                            console.log("skipping pool: " + pool.depositToken);
                                            _a.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }, index * 2000); //index * 2000 to avoid possible rate limiting
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = setup;

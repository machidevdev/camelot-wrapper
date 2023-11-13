export type NftPool = {
            poolEmissionRate: number,
            isFarm: boolean,
            totalDeposit: string,
            allocPoint: number,
            totalDepositWithMultiplier: string,
            maxGlobalMultiplier: number,
            maxLockDuration: number,
            maxLockMultiplier: number,
            maxBoostMultiplier: number,
            xGrailRewardsShare: number,
            totalBoostAllocated: string,
            address: string,
            depositToken: string,
            emergencyUnlock: boolean,
            tvlUSD: number,
            minIncentivesApr: number,
            maxIncentivesApr: number,
            name: string,
            nitro?: NitroPool
}

/**
 * {"0xbAc8809494D16C39BEc6e0FEE57692B195e98495":{"nftPool":"0x6BC938abA940fB828D39Daa23A94dfc522120C11","rewardsToken1":"0x3CAaE25Ee616f2C8E13C74dA0813402eae3F496b","rewardsToken2":"0x0000000000000000000000000000000000000000","rewardsToken1Amount":"1531343663644962057703","rewardsToken2Amount":"0","rewardsToken1RemainingAmount":"0","rewardsToken2RemainingAmount":"0","totalDepositAmount":"404135191770720","rewardsToken1PerSecond":"0","rewardsToken2PerSecond":"0","owner":"0xF7C9301C1245c6BC96543Bf1Bf5dfDB2de6F2679","published":true,"whitelistLength":0,"creationTime":1669078981,"publishTime":1669135046,"isTransferWhitelisted":true,"customReqContract":"0x0000000000000000000000000000000000000000","startTime":1669222800,"endTime":1703091600,"harvestStartTime":1670432400,"depositEndTime":1670000400,"requiredLockDuration":0,"requiredLockEnd":0,"requiredDepositAmount":"0","whitelist":false,"description":"","emergencyClose":true,"tvlUSD":40639.09935476412,"incentivesApr":0}
 */
export type NitroPool = {
    nftPool: string,
    rewardsToken1: string,
    rewardsToken2: string,
    rewardsToken1Amount: string,
    rewardsToken2Amount: string,
    rewardsToken1RemainingAmount: string,
    rewardsToken2RemainingAmount: string,
    totalDepositAmount: string,
    rewardsToken1PerSecond: string,
    rewardsToken2PerSecond: string,
    owner: string,
    published: boolean,
    whitelistLength: number,
    creationTime: number,
    publishTime: number,
    isTransferWhitelisted: boolean,
    customReqContract: string,
    startTime: number,
    endTime: number,
    harvestStartTime: number,
    depositEndTime: number,
    requiredLockDuration: number,
    requiredLockEnd: number,
    requiredDepositAmount: string,
    whitelist: boolean,
    description: string,
    emergencyClose: boolean,
    tvlUSD: number,
    incentivesApr: number
}

export type NFTPools = {
    data: {
        lastSync: number,
        nftPools: NftPool[]
    }
}

export type NitroPools ={
    data: {
        lastSync: number,
        nitros: NitroPool[]
    }
}

/**
 * {
  "name": "Camelot default token list",
  "timestamp": "2023-11-09T23:22:12.360Z",
  "version": {
    "major": 1,
    "minor": 0,
    "patch": 0
  },
  "tags": {},
  "logoURI": "https://app.camelot.exchange/images/logo-sm.svg",
  "keywords": [
    "camelot",
    "default"
  ],
  "tokens": [
    {
      "chainId": 42161,
      "symbol": "ACID",
      "name": "Acid",
      "address": "0x29C1EA5ED7af53094b1a79eF60d20641987c867e",
      "logoURI": "https://token-list.camelot.exchange/assets/acid.svg",
      "decimals": 9,
      "quote": "other"
    }[]
 */
export type tokenDataType = {
    chainId: number,
    symbol: string,
    name: string,
    address: string,
    logoURI: string,
    decimals: number,
    quote: string
}

export type tokenDataRequestType = {
    name: string,
    timestamp: string,
    version: {
        major: number,
        minor: number,
        patch: number
    },
    tags: {},
    logoURI: string,
    keywords: string[],
    tokens: tokenDataType[]
}



/**
 * {"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1":{"symbol":"WETH","name":"Wrapped Ether","decimals":"18","price":2053.5955439237946,"volumeUSD":1801620071.193883,"tvlUSD":23037959.8901952,"address":"0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"}
 */
export type tokenStatType =  {
        symbol: string,
        name: string,
        decimals: string,
        price: number,
        volumeUSD: number,
        tvlUSD: number,
        address: string
}

export type tokenStatListType = {
    data: {
        lastSync: number,
        tokens: tokenStatType[]
    }
}

export type Cache = {
    timestamp: number | null,
    data: Map<string, any>
};


export type tokenSymbolsType = {
    data: {
        pair: {
            id: string,
            token0: {
                id: string
            },
            token1: {
                id: string
            }
        }
    }
}




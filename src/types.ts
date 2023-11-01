export type NftPool = {
            poolEmissionRate: string,
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
            name: string
}

export type NFTPools = {
    data: {
        lastSync: number,
        nftPools: NftPool[]
    }
}

export type tokensType = {
    data: {
        lastSync: number,
        tokens: {
            [key: string]: {
                symbol: string,
                name: string,
                address: string,
                price: number,
                tvlUSD: number,
                volumeUSD: number
            }
        }[]
    }

}



/**
 * {
  "data": {
    "pair": {
      "id": "0xa6c5c7d189fa4eb5af8ba34e63dcdd3a635d433f",
      "token0": {
        "name": "Wrapped Ether"
      },
      "token1": {
        "name": "Arbitrum"
      }
    }
  }
}
 */

export type tokenSymbolsType = {
    data: {
        pair: {
            id: string,
            token0: {
                name: string
            },
            token1: {
                name: string
            }
        }
    }
}


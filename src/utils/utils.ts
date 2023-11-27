import holy from "../contracts/holy"
import holyEthOracle from "../contracts/holyEth"
import { getViemClient } from "../viemClient"
import { Token, poolModel } from "../schemas/poolSchema"
import { calculateAPR, calculateNitroApr } from "./apr"
import { lpResponseSchema, lpResponseType } from "../schemas/lpResponseSchema"
import { mirrorPoolType } from "../schemas/mirrorPoolSchema"
import fetchAndValidate from "../validations/fetchAndValidate"
import { tokenPriceResponseSchema, tokenPriceType } from "../schemas/tokenPriceResponseSchema"
import { tokenDataResponseSchema, tokenDataType } from "../schemas/tokenDataResponseSchema"
import { nitroPoolType } from "../schemas/nitroPoolSchema"

const PRICE_CACHE_DURATION = 600000; // 10 minutes in milliseconds
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1".toLowerCase()

export const tokenPriceCache = {
  timestamp: 0,
  data: new Map<string, number>(),
};

export const tokenDataCache = {
  timestamp: 0,
  data: new Map<string, tokenDataType>(),
}


function createGraphQlCall(address: string) {
  return `query TokenQuery{
    pair(id: "${address}") {
      id
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }`;
}

//get token symbols from lp address
export async function fetchTokenSymbols(address: string): Promise<lpResponseType> {
  try {
    const response = await fetch(process.env.GRAPHQL_TOKEN_ENDPOINT || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: createGraphQlCall(address.toLowerCase()) }),
    });

    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    } else if (response.status !== 200) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const symbols = await response.json();
    return lpResponseSchema.parse(symbols)

  } catch (error) {
    throw new Error(`Error fetching token symbols for address ${address}: ${error}`);
  }
}


export async function updateTokenDataCache() {
  const now = Date.now();

  if (tokenDataCache.timestamp && (now - tokenDataCache.timestamp < PRICE_CACHE_DURATION)) {
    //console.log("Cache is still valid");
    return;
  }

  const tokenList = await fetchAndValidate(process.env.TOKENS_DATA_ENDPOINT || "", tokenDataResponseSchema);
  tokenDataCache.timestamp = now;
  tokenList.tokens.forEach(token => {
    tokenDataCache.data.set(token.address.toLowerCase(), token)
  })
  return tokenDataCache;
}



export async function updatePriceCache() {
  const now = Date.now();
  const viemClient = getViemClient()
  if (tokenPriceCache.timestamp && (now - tokenPriceCache.timestamp < PRICE_CACHE_DURATION)) {
    //console.log("Cache is still valid");
    return;
  }

  const tokenList = await fetchAndValidate(process.env.TOKENS_PRICE_ENDPOINT || "", tokenPriceResponseSchema)
  const holyEthPrice = await viemClient.readContract({
    address: holyEthOracle.address as `0x${string}`,
    abi: holyEthOracle.abi,
    functionName: "getSpot",
  });
  tokenPriceCache.timestamp = now;
  const filtered = Object.values(tokenList.data.tokens).filter((token: tokenPriceType) => {
    return token.price != 0 && token.tvlUSD != 0 && token.volumeUSD != 0
  })
  filtered.forEach((token: tokenPriceType) => {
    tokenPriceCache.data.set(token.address.toLowerCase(), token.price)
  })
  const holyUsdPrice = Number(holyEthPrice) * Number(tokenPriceCache.data.get(WETH));
  tokenPriceCache.data.set(holy.address.toLowerCase(), holyUsdPrice);
  return tokenPriceCache;
}



// Function to find a token by its address
async function fetchTokenPrice(address: string): Promise<number | null> {
  await updatePriceCache(); // Ensure the cache is up-to-date before searching
  const tokenData = tokenPriceCache.data.get(address.toLowerCase());
  if (tokenData) {
    return tokenData;
  } else {
    console.error('Token not found:', address);
    return null;
  }
}

async function fetchTokenData(address: string) {
  await updateTokenDataCache();
  const tokenData = tokenDataCache.data.get(address.toLowerCase());
  return tokenData;
}

export async function fetchLPData(lpAddress: string) {
  try {
    await updateTokenDataCache();
    const ids = await fetchTokenSymbols(lpAddress);

    if (!ids || !ids.data.pair) {
      console.error('Invalid response from fetchTokenSymbols:', ids);
      return null;
    }

    const token0Address = ids.data.pair.token0.id
    const token1Address = ids.data.pair.token1.id
    const token0Data = await fetchTokenData(token0Address);
    const token1Data = await fetchTokenData(token1Address);

    if (!token0Data) {
      console.error(`Token data not found in cache for Token0 with address: ${token0Address}`);
    }

    if (!token1Data) {
      console.error(`Token data not found in cache for Token1 with address: ${token1Address}`);
    }

    if (!token0Data || !token1Data) {
      return null;
    }

    return [
      {
        address: token0Address,
        symbol: token0Data.symbol,
        image: token0Data.logoURI,
      },
      {
        address: token1Address,
        symbol: token1Data.symbol,
        image: token1Data.logoURI,
      }
    ];
  } catch (error) {
    console.error('Error in fetchLPData:', error);
    return null;
  }
}





export async function fetchNitroTokenData(nitro: nitroPoolType):Promise<Token[]> {
  const token1Data = await fetchTokenData(nitro.rewardsToken1);
  if (nitro.rewardsToken2 != "0x00") {
    const token2Data = await fetchTokenData(nitro.rewardsToken2);
    if (token1Data && token2Data) {
      return [
        {
          address: nitro.rewardsToken1,
          symbol: token1Data.symbol,
          image: token1Data.logoURI,
        },
        {
          address: nitro.rewardsToken2,
          symbol: token2Data.symbol,
          image: token2Data.logoURI,
        }
      ];
    }

  }
  //token1 always exists, while token2 is not always present
  if (!token1Data) {
    throw new Error(`Token data not found in cache for Token0 with address: ${nitro.rewardsToken1}`);
    
  }
  else {
    return [
      {
        address: nitro.rewardsToken1,
        symbol: token1Data?.symbol,
        image: token1Data?.logoURI,
      },
    ];
  }

}



export async function addPoolToDB(pool: mirrorPoolType) {
  //check if pool has nitro first of all. if it does, calculate min-max base apr and nitro aprs. if not, only base apr
  //also get all token symbols needed for pool
  let nitroAPR = 0;
  const { baseAPR, maxAPR } = await calculateAPR(pool);
  const lpData = await fetchLPData(pool.depositToken);
  let nitroTokenData: Token[] = []
  if (pool.nitro) {
    nitroAPR = await calculateNitroApr(pool.nitro);
    nitroTokenData = await fetchNitroTokenData(pool.nitro);

  }
  const p = new poolModel({
    name: lpData ? lpData[0].symbol + "-" + lpData[1].symbol : "Unknown",
    address: pool.address,
    isNitro: pool.nitro ? true : false,
    depositToken: pool.depositToken,
    minAPR: baseAPR,
    maxAPR: maxAPR,
    nitroAPR: nitroAPR,
    lpTokens: lpData,
    nitroTokens: nitroTokenData,
    tvlUSD: 0,
    bonusShare: pool.xGrailRewardsShare
  })
  await p.save()
  console.log(`Added ${pool.depositToken} to db`)

}



export async function updatePoolInDB(pool: mirrorPoolType) {
  //update aprs and tvl
  const { baseAPR, maxAPR } = await calculateAPR(pool);
  if (pool.nitro) {
    const nitroAPR = await calculateNitroApr(pool.nitro);
    await poolModel.updateOne({ address: pool.address }, { minAPR: baseAPR, maxAPR: maxAPR, nitroAPR: nitroAPR })
  }
}

// A helper function to delay the execution
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}




export {
  fetchTokenPrice,
  delay
}
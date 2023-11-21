import Pool from "../db/nftPool"
import master from "../contracts/master"
import spNftAbi from "../contracts/abis/spNft"
import { viemClient } from "../client"
import holy from "../contracts/holy"
import holyEthOracle from "../contracts/holyEth"
import { NftPool, Cache, tokenStatListType, tokenStatType, tokenDataRequestType, tokenDataType, tokenSymbolsType, NitroPool } from "../types"
import mongoose, { mongo } from "mongoose"

const PRICE_CACHE_DURATION = 600000; // 10 minutes in milliseconds
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";
const CAMELOT_API_URL = "https://api.camelot.exchange/v2/nft-pools";
const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm";
const TOKEN_STATS_URL = "https://api.camelot.exchange/v2/tokens"
const TOKEN_DATA_URL = "https://token-list.camelot.exchange/tokens.json"
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1".toLowerCase()

export const tokenPriceCache: Cache = {
  timestamp: null,
  data: new Map(),
};

export const tokenDataCache : Cache = {
  timestamp: null,
  data: new Map(),
}


function getTokenPairByAddress(address: string) {
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
export async function fetchTokenSymbols(address: string): Promise<tokenSymbolsType | null> {
  try {
    const response = await fetch(GRAPH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: getTokenPairByAddress(address.toLowerCase()) }),
    });

    if (response.status === 429) {
      console.error("Rate limited...");
      return null;
    } else if (response.status !== 200) {
      console.error(`Error fetching token symbols: ${response.status}`);
      return null;
    }

    return await response.json() as tokenSymbolsType;
  } catch (error) {
    console.error(`Error fetching token symbols: ${error}`);
    return null;
  }
}


export async function updateTokenDataCache() {
  const now = Date.now();

  if (tokenDataCache.timestamp && (now - tokenDataCache.timestamp < PRICE_CACHE_DURATION)) {
    //console.log("Cache is still valid");
    return;
  }

  const response = await fetch(TOKEN_DATA_URL);
  const tokenList = await response.json() as tokenDataRequestType;
  tokenDataCache.timestamp = now;
  tokenList.tokens.forEach(token => {
    tokenDataCache.data.set(token.address.toLowerCase(), {
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,    
    })
  })
  return tokenDataCache;
}



export async function updatePriceCache() {
  const now = Date.now();

  if (tokenPriceCache.timestamp && (now - tokenPriceCache.timestamp < PRICE_CACHE_DURATION)) {
    //console.log("Cache is still valid");
    return;
  }

  const response = await fetch('https://api.camelot.exchange/v2/tokens');
  const tokenList = await response.json() as tokenStatListType;
  const holyEthPrice = await viemClient.readContract({
    address: holyEthOracle.address as `0x${string}`,
    abi: holyEthOracle.abi,
    functionName: "getSpot",
  });
  tokenPriceCache.timestamp = now;
  const filtered = Object.values(tokenList.data.tokens).filter(token => {
    return token.price != 0 && token.tvlUSD != 0 && token.volumeUSD != 0
  })
  filtered.forEach(token => {
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

async function fetchTokenData(address:string) {
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





export async function fetchNitroTokenData(nitro:NitroPool) {
  const token1Data = await fetchTokenData(nitro.rewardsToken1);
  if(nitro.rewardsToken2 != "0x00"){
    const token2Data = await fetchTokenData(nitro.rewardsToken2);
    if(token1Data && token2Data){
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
  else{
    return [
      {
        address: nitro.rewardsToken1,
        symbol: token1Data.symbol,
        image: token1Data.logoURI,
      },
    ];
  }
  //token1 always exists, while token2 is not always present
  if (!token1Data) {
    console.error(`Token data not found in cache for Token0 with address: ${nitro.rewardsToken1}`);
    return null;
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
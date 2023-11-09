import Pool from "./db/nftPool"
import master from "./contracts/master"
import spNftAbi from "./contracts/abis/spNft"
import { viemClient } from "./client"
import holy from "./contracts/holy"
import holyEthOracle from "./contracts/holyEth"
import { NftPool, tokenSymbolsType } from "./types"


const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";
const CAMELOT_API_URL = "https://api.camelot.exchange/v2/nft-pools";
const GRAPH_API_URL = "https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm";

async function fetchPrice(id: string): Promise<number | null> {
    try {
        const response = await fetch(`${COINGECKO_API_URL}?ids=${id}&vs_currencies=usd`);
        if (response.ok) {
            const data = await response.json() as { [key: string]: { usd: number } };
            return data[id].usd;
        } else {
            console.error(`Error fetching price for ${id}: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching price for ${id}: ${error}`);
        return null;
    }
}


function createGraphQlCall(address: string) {
    return `query TokenQuery{
      pair(id: "${address}") {
        id
        token0 {
          name
        }
        token1 {
          name
        }
      }
    }`;
  }


  async function fetchTokenSymbols(address: string): Promise<tokenSymbolsType | null> {
    try {
      const response = await fetch(GRAPH_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: createGraphQlCall(address.toLowerCase()) }),
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


  async function calculateAPR(pool: NftPool): Promise<number | null> {
    try {
        const emissionRate = await viemClient.readContract({
        address: master.address,
        abi: master.abi,
        functionName: "emissionRate",
        });
    
        const emissionRatePerYear = Number(emissionRate) * 31536000;
        const holyShare = emissionRatePerYear / (pool.xGrailRewardsShare / 100);
        const grailShare = emissionRatePerYear - holyShare;
    
        const grailPrice = await fetchPrice("camelot-token");
        const grailValue = Number(grailPrice) * Number(grailShare) / Math.pow(10,18);
    
        const holyAmount = await viemClient.readContract({
        address: holy.address as `0x${string}`,
        abi: holy.abi,
        functionName: "previewDeposit",
        args: [BigInt(holyShare)],
        });
        console.log("holy share: " + holyShare, "holy amount: " + holyAmount )
    
        const holyToEth = await viemClient.readContract({
        address: holyEthOracle.address as `0x${string}`,
        abi: holyEthOracle.abi,
        functionName: "getSpot",
        });
        console.log("holy to eth: " + holyToEth)
        const holyEthValue = Number(holyAmount) / Math.pow(10,18) * Number(holyToEth) / Math.pow(10,18);
        const ethPrice = await fetchPrice("ethereum");
        const holyValueUsd = Number(holyEthValue) * ethPrice!;
        

    
        return (grailValue + holyValueUsd) / pool.tvlUSD;
    } catch (error) {
        console.error(`Error calculating APR for ${pool.depositToken}: ${error}`);
        return null;
    }
}


export {
    fetchPrice,
    fetchTokenSymbols,
    calculateAPR
}
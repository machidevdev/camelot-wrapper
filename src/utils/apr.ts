import { getViemClient } from "../viemClient";
import holy from "../contracts/holy";
import { fetchTokenPrice } from "./utils";
import { mirrorPoolType } from "../schemas/mirrorPoolSchema";
import { nitroPoolType } from "../schemas/nitroPoolSchema";

const GRAIL_ADDRESS = "0x3d9907F9a368ad0a51Be60f7Da3b97cf940982D8"



// Constants
const SECONDS_IN_YEAR = 31536000;
const DECIMALS = Math.pow(10, 18);

// Helper function to calculate token value in USD
async function calculateTokenValueUsd(tokenAddress: string, tokenAmountPerYear: number): Promise<number> {
  const tokenPrice = await fetchTokenPrice(tokenAddress);
  return Number(tokenPrice) * tokenAmountPerYear / DECIMALS;
}

// Calculate APR Value
async function calculateAPRValue(pool: mirrorPoolType, emissionRatePerYear: number): Promise<number> {
  const viemClient = getViemClient()
  const holyShare = emissionRatePerYear / (pool.xGrailRewardsShare / 100);
  const grailShare = emissionRatePerYear - holyShare;

  const grailValueUsd = await calculateTokenValueUsd(GRAIL_ADDRESS, grailShare);
  const holyAmount = await viemClient.readContract({
    address: holy.address as `0x${string}`,
    abi: holy.abi,
    functionName: "previewDeposit",
    args: [BigInt(holyShare)],
  });

  const holyValueUsd = await calculateTokenValueUsd(holy.address, Number(holyAmount));

  // Minimum APR
  return (grailValueUsd + holyValueUsd) / pool.tvlUSD / Math.pow(10,16); //10**18 then * 100 to get percentage
}

// Calculate APR
async function calculateAPR(pool: mirrorPoolType): Promise<{ baseAPR: number | null, maxAPR: number | null }> {
  try {
    const baseEmissionRatePerYear = Number(pool.poolEmissionRate) * SECONDS_IN_YEAR;
    const baseAPRValue = await calculateAPRValue(pool, baseEmissionRatePerYear);

    const maxEmissionRatePerYear = baseEmissionRatePerYear + baseEmissionRatePerYear * (Number(pool.maxGlobalMultiplier) / 100);
    const maxAPRValue = await calculateAPRValue(pool, maxEmissionRatePerYear);

    return { baseAPR: baseAPRValue, maxAPR: maxAPRValue };
  } catch (error) {
    console.error(`Error calculating APR for ${pool.depositToken}:`, error);
    return { baseAPR: null, maxAPR: null };
  }
}

// Calculate Nitro APR
export async function calculateNitroApr(pool: nitroPoolType): Promise<number> {
  let totalApr = 0;

  const rewardsToken1PerYear = Number(pool.rewardsToken1PerSecond) * SECONDS_IN_YEAR;
  const rewardsToken1Apr = await calculateTokenValueUsd(pool.rewardsToken1, rewardsToken1PerYear) / pool.tvlUSD;
  totalApr += rewardsToken1Apr;

  if (pool.rewardsToken2 !== "0x00") {
    const rewardsToken2PerYear = Number(pool.rewardsToken2PerSecond) * SECONDS_IN_YEAR;
    const rewardsToken2Apr = await calculateTokenValueUsd(pool.rewardsToken2, rewardsToken2PerYear) / pool.tvlUSD;
    totalApr += rewardsToken2Apr;
  }
  return totalApr * 100;
}

export {
  calculateAPR
}

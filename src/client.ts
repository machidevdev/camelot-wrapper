import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

export const viemClient = createPublicClient({
  chain: arbitrum,
  transport: http("https://holy-testnet.up.railway.app"),
});

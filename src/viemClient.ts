import { PublicClient, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

let client: PublicClient | null = null;

export const getViemClient: () => PublicClient = () => {
    if (client === null) {
        client = createPublicClient({
            chain: arbitrum,
            transport: http("https://holy-testnet.up.railway.app"),
        });
    }
    return client!;
};

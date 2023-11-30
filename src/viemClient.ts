import { PublicClient, createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { config, } from "./config";

let client: PublicClient | null = null;

export const getViemClient: () => PublicClient = () => {
    if (client === null) {
        client = createPublicClient({
            chain: arbitrum,
            transport: http(config.rpcEndpoint),
        });
    }
    return client!;
};

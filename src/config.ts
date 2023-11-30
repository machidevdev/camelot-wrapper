// config.ts
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}


export const config = {
    mongoDbUri: getEnvVar('MONGODB_URI'),
    nitroEndpoint: getEnvVar('NITRO_ENDPOINT'),
    mirrorEndpoint: getEnvVar('MIRROR_ENDPOINT'),
    tokensDataEndpoint: getEnvVar('TOKENS_DATA_ENDPOINT'),
    tokensPriceEndpoint: getEnvVar('TOKENS_PRICE_ENDPOINT'),
    graphqlTokenEndpoint: getEnvVar('GRAPHQL_TOKEN_ENDPOINT'),
    rpcEndpoint: getEnvVar('RPC_ENDPOINT'),
};

import { z } from 'zod';

const tokenDataSchema = z.object({
  chainId: z.number(),
  symbol: z.string(),
  name: z.string(),
  address: z.string(),
  logoURI: z.string(),
  decimals: z.number(),
  quote: z.string(),
});

const tokenDataResponseSchema = z.object({
  name: z.string(),
  timestamp: z.string(),
  version: z.object({
    major: z.number(),
    minor: z.number(),
    patch: z.number(),
  }),
  tags: z.record(z.unknown()),
  logoURI: z.string(),
  keywords: z.array(z.string()),
  tokens: z.array(tokenDataSchema),
});

type tokenDataType = z.infer<typeof tokenDataSchema>;

export { tokenDataType, tokenDataResponseSchema };

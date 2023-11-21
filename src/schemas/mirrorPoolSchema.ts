import { z } from 'zod';

const mirrorPoolSchema = z.object({
  poolEmissionRate: z.string(),
  isFarm: z.boolean(),
  totalDeposit: z.string(),
  allocPoint: z.number(),
  totalDepositWithMultiplier: z.string(),
  maxGlobalMultiplier: z.number(),
  maxLockDuration: z.number(),
  maxLockMultiplier: z.number(),
  maxBoostMultiplier: z.number(),
  xGrailRewardsShare: z.number(),
  totalBoostAllocated: z.string(),
  address: z.string(),
  depositToken: z.string(),
  emergencyUnlock: z.boolean(),
  tvlUSD: z.number(),
  minIncentivesApr: z.number(),
  maxIncentivesApr: z.number()
});

const mirrorPoolsSchema = z.record(z.string(), mirrorPoolSchema);

const dataSchema = z.object({
  lastSync: z.number(),
  nftPools: mirrorPoolSchema
});

const mirrorSchema = z.object({
  data: dataSchema
});

type mirrorPoolType = z.infer<typeof mirrorSchema>


export { mirrorPoolSchema, mirrorPoolsSchema, dataSchema, mirrorSchema, mirrorPoolType  }

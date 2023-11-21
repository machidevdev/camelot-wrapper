import { z } from 'zod';

const nitroPoolSchema = z.object({
  nftPool: z.string(), 
  rewardsToken1: z.string(),
  rewardsToken2: z.string(),
  rewardsToken1Amount: z.string(),
  rewardsToken2Amount: z.string(),
  rewardsToken1RemainingAmount: z.string(),
  rewardsToken2RemainingAmount: z.string(),
  totalDepositAmount: z.string(),
  rewardsToken1PerSecond: z.string(),
  rewardsToken2PerSecond: z.string(),
  owner: z.string(),
  published: z.boolean(),
  whitelistLength: z.number(),
  creationTime: z.number(),
  publishTime: z.number(),
  isTransferWhitelisted: z.boolean(),
  customReqContract: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  harvestStartTime: z.number(),
  depositEndTime: z.number(),
  requiredLockDuration: z.number(),
  requiredLockEnd: z.number(),
  requiredDepositAmount: z.string(),
  whitelist: z.boolean(),
  description: z.string(),
  emergencyClose: z.boolean(),
  tvlUSD: z.number(),
  incentivesApr: z.number()
});

const nitroPoolsSchema = z.record(nitroPoolSchema);

const dataSchema = z.object({
  lastSync: z.number(),
  nitros: nitroPoolsSchema
});

const nitroSchema = z.object({
  data: dataSchema
});

type nitroType = z.infer<typeof nitroSchema>

export {nitroPoolSchema, nitroPoolsSchema, nitroSchema, nitroType }
import { z } from 'zod';

const supportedLpSchema = z.object({
  id: z.string(),
});

const dataSchema = z.object({
  supportedLps: z.array(supportedLpSchema),
});

const eligibleLpSchema = z.object({
  data: dataSchema,
});


export {eligibleLpSchema} 
import { z } from "zod";

const SupportedLpSchema = z.object({
  nitroPool: z.string(),
  spNft: z.string(),
  lp: z.string(),
});

const SupportedLpsSchema = z.object({
  supportedLps: z.array(SupportedLpSchema),
});

const supportedLpResponseSchema = z.object({
  data: SupportedLpsSchema,
});

export type supportedLpResponseType = z.infer<typeof supportedLpResponseSchema>;
export type supportedLpType = z.infer<typeof SupportedLpSchema>;
export { supportedLpResponseSchema };
import { z } from 'zod';

// Define a generic schema for the data part of the response
const genericDataSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.lazy(() => genericDataSchema)),
    z.record(z.lazy(() => genericDataSchema)),
]);

// Define a schema for the error part of the response
const errorSchema = z.object({
    code: z.string(),
    message: z.string(),
});

// Define the overall API response schema
const apiResponseSchema = z.object({
    status: z.literal('success').or(z.literal('failure')),
    message: z.string().optional(),
    data: genericDataSchema.optional(),
    error: errorSchema.optional(),
});

// Type for API response
type ApiResponse = z.infer<typeof apiResponseSchema>;

export { apiResponseSchema, ApiResponse };

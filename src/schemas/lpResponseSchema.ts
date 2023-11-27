import { z } from 'zod';
/**
 *  data: {
        pair: {
            id: string,
            token0: {
                id: string
            },
            token1: {
                id: string
            }
        }
    }
 */
const lpResponseSchema = z.object({
    data: z.object({
        pair: z.object({
            id: z.string(),
            token0: z.object({
                id: z.string()
            }),
            token1: z.object({
                id: z.string()
            })
        })
    })
});


type lpResponseType = z.infer<typeof lpResponseSchema>;



export {lpResponseSchema, lpResponseType}
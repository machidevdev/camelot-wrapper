import {z} from 'zod';



const searchSchema = z.object({
    search: z.string()
})


export {
    searchSchema
}
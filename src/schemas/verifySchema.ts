import {z} from 'zod'

export const  verifySchema = z.object({
    code : z.string().max( 6 , "validation code must be of 6 character")
})
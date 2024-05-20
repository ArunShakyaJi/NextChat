import {z} from 'zod'

export const  messageSchema = z.object({
    content : z.string()
                .min(10 , 'contet must be atleast of 10 characters')
                .max(300 , 'Content limit exceed.')

})


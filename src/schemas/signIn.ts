import {z} from 'zod'

export const  signInSchema = z.object({
    identifier : z.string(), //it is the username
    password : z.string()
})


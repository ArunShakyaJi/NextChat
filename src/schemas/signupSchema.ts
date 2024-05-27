import {z} from 'zod' ;

export const userValidation = z
                                .string()
                                .min(2 , 'UserName must be of 6 character')
                                .max(11 , 'Usernmae not more than 11 characters')
                                .regex( /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+ $/
                                    , "username must not contain any special characters ")

                                    
export const signupSchema = z.object({
    username : userValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6 , {message : "Password must be of 6 characters"})
})
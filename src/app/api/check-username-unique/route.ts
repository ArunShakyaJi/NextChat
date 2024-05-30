import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";

// when using  zod you require to define schema

import { userValidation } from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
    username: userValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }

        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log("result", result);

        if (!result.success) {
            console.log("safe params works")
            const UsernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: UsernameErrors.length > 0 ? UsernameErrors.join(', ') : "Invalid given credentials"
            },
                {
                    status: 400
                })
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                status: false,
                message: "Username already taken"
            },
                {
                    status: 400
                })
        }

        return Response.json({
            status: true,
            message: "Username available"
        },
            {
                status: 200
            })

    } catch (error) {
        console.error("Error in check-username-unique route GET method")
        return Response.json({
            success: false,
            message: "user find error"

        },
            {
                status: 500
            })
    }
}
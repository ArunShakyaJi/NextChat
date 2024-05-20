import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { boolean } from "zod";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingAndVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingAndVerifiedUser) {
            return Response.json({
                success: false,
                message: 'User already exists'
            },
                {
                    status: 400

                })
        }

        const existingUserbyEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exists'
                },
                    {
                        status: 400

                    })

            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserbyEmail.password = hashedPassword;
                existingUserbyEmail.verifyCode = verifyCode;
                existingUserbyEmail.verifyCodeExpire = new Date(Date.now() + 3600000);

                await existingUserbyEmail.save();
            }
        } else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const expireDate = new Date();
            const expiryDate = expireDate.setHours(expireDate.getHours() + 1);


            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire : expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                Messages: [],
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(username, email, verifyCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },
                {
                    status: 500
                })
        }


        return Response.json({
            success: true,
            message: 'User created successfully , please verify your email to login'
        },
            {
                status: 201
            })

    } catch (error) {
        console.error('Error registoring user', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
}
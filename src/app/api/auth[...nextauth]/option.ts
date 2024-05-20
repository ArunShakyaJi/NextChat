import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("Invalid credentials")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your dedtails")
                    }

                    // this will give boolean value if password is correct or not
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password)

                    if (isValidPassword) {
                        return user
                    } else {
                        throw new Error("Invalid Password")
                    }


                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id ;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.email = token.email;
                
            }


            return session
        },
        async jwt({ token, user }) {

          if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.email = user.email?.toString();
          }

            return token    
        }
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.SECRET_KEY,
}
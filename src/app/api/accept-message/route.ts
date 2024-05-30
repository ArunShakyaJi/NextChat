import { getServerSession } from "next-auth";
import { authOptions } from "../auth[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Session } from "inspector";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !session?.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"

        },
            {
                status: 500
            })
    }

    const userId = user?._id
    const { acceptingMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptingMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Error while reciving messages"

            },
                {
                    status: 401
                })
        }

        return Response.json({
            success: true,
            message: "Message Accepted Successfully Updated",
            updatedUser

        },
            {
                status: 200
            })

    } catch (error) {
        console.log("Error while reciving messages")
        return Response.json({
            success: false,
            message: "Error while reciving messages"

        },
            {
                status: 500
            })
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user = session?.user

    const userId =  user?._id
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"

        },
            {
                status: 401
            })
    }

   try {
     const FindUser = await UserModel.findById(userId)
 
     if(!FindUser){
         return Response.json({
             success: false,
             message: "User not found"
 
         },
             {
                 status: 404
             })
     }
 
     return Response.json({
         success: true,
         isAcceptingMessages : FindUser.isAcceptingMessages , 
         message: "Accepting Message",
 
 
     },
         {
             status: 200
         })
   } catch (error) {
    return Response.json({
        success: true,
        message: "Error in getting message acceptance status",


    },
        {
            status: 500
        })
   }
}


import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {

    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUser = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodedUser
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 500
                })
        }

        const  isCodeValid = user.verifyCode === code 
        const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date()

        if(isCodeValid && isCodeNotExpired){
            return Response.json({
                success: true,
                message: "Account vrified successfully"
            },
                {
                    status: 200
                })
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: true,
                message: "Verification code expired Please verify again"
            },
                {
                    status: 400
                })
        }

        else {
            return Response.json({
                success: false,
                message: "Incorrect verification code "
            },
                {
                    status: 400
                })
        
        }
    } catch (error) {
        console.error("Error while verifying otp")
        return Response.json({
            success: false,
            message: "Invalid Code"

        },
            {
                status: 500
            })
    }
}
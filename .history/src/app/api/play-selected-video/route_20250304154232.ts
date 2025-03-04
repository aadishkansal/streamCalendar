import { sendForgotPassEmail } from "@/helpers/sendForgotPassEmail";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { url } = await request.json();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;


        if (!user || !session) {
            return Response.json(
                { success: false, message: "Not Authenticaated" },
                { status: 401 }
            );
        }

        
        return Response.json(
            {
                success: true,
                message: 'OTP successfully sent. Check your mail inbox',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error resending OTP", error);
        return Response.json(
            { success: false, message: "Error resending OTP" },
            { status: 500 }
        );
    }
}

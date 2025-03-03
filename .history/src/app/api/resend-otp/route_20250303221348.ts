import { sendForgotPassEmail } from "@/helpers/sendForgotPassEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email } = await request.json();
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        let otpCode = Math.floor(100000 + Math.random() * 900000).toString();


        user.forgotPassCode = otpCode;
        user.forgotPassCodeExpiry = new Date(Date.now() + 300 * 1000);
        await user.save();

        const username = user.username;

        const emailResponse = await sendForgotPassEmail(
          email,
          username,
          otpCode
        );
        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
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
        console.error("Error resending OTP:", error);
        return Response.json(
            { success: false, message: "Error resending OTP" },
            { status: 500 }
        );
    }
}

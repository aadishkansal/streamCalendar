import { sendForgotPassEmail } from "@/helpers/sendForgotPassEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const now = Date.now();
    const expiry = user.forgotPassCodeExpiry?.getTime() || 0;

    if (expiry > now) {
      return Response.json(
        { success: false, message: "OTP already sent" },
        { status: 400 }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.forgotPassCode = otpCode;
    user.forgotPassCodeExpiry = new Date(now + 5 * 60 * 1000);
    await user.save();

    const emailResponse = await sendForgotPassEmail(email, user.username, otpCode);
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "OTP successfully sent. Check your mail inbox" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json(
      { success: false, message: "Error sending OTP" },
      { status: 500 }
    );
  }
}


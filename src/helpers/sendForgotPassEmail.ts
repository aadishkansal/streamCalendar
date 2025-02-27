import { resend } from "@/lib/resend";
import ForgotPassEmail from "../../emails/forgotPassEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendForgotPassEmail(
  forgotPassEmail: string,
  forgotPassUsername: string,
  forgotPassCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: forgotPassEmail,
      subject: "Password reset Code",
      react: ForgotPassEmail({ username: forgotPassUsername, otp: forgotPassCode }),
    });
    return { success: true, message: "Forgot password email sent successfully." };
  } catch (emailError) {
    console.error("Error sending forgot password email:", emailError);
    return { success: false, message: "Failed to send forgot password email." };
  }
}

import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';
import forgotPassEmail from '../../emails/forgotPassEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendForgotPassEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  console.log("sendForgotPassEmail called with:", { email, username, otp });
  console.log("API Key exists:", !!process.env.RESEND_API_KEY);
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Using Resend's test domain
      to: 'aniketsahu0307@gmail.com', // For testing, using a hardcoded email
      // to: [email], // Will be used in production
      subject: 'Stream Calendar - Password Reset Code',
      react: forgotPassEmail({ username, otp }),
    });

    console.log("Resend response - data:", data);
    console.log("Resend response - error:", error);

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, message: error.message || 'Failed to send email' };
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (emailError) {
    console.error('Exception in sendForgotPassEmail:', emailError);
    return { success: false, message: 'Failed to send email' };
  }
}
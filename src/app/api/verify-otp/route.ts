import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, otp } = await request.json();
    const decodedEmail = decodeURIComponent(email);
    const user = await UserModel.findOne({ email: decodedEmail });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if(!user.forgotPassCodeExpiry){
      return Response.json(
        { success: false, message: 'User has no OTP' },
        { status: 404 }
      );
    }

    const isCodeValid = user.forgotPassCode === otp;
    const isCodeNotExpired = new Date(user.forgotPassCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await user.save();

      return Response.json(
        { success: true, message: 'OTP verified successfully' },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            'OTP has expired',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: 'Incorrect OTP' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return Response.json(
      { success: false, message: 'Error verifying OTP' },
      { status: 500 }
    );
  }
}
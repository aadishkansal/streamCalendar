import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const {email, password, confirmedPassword } = await request.json();

    if (!email || !password || !confirmedPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if(password!=confirmedPassword){
        return Response.json(
            {
              success: false,
              message:
                "Passwords don't match",
            },
            { status: 400 }
        );
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    return Response.json(
        { success: true, message: 'Password changed successfully' },
        { status: 200 }
    );

  } catch (error) {
    console.error('Error changing password', error);
    return Response.json(
      { success: false, message: 'Error changing password' },
      { status: 500 }
    );
  }
}
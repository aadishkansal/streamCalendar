import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const {email, password, confirmedPassword } = await request.json();
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

    user.password = password;
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
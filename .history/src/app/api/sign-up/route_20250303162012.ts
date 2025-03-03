import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import dotenv

//OAuth yet to be handled

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, username, email, password } = await request.json();

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: "Username is taken" }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({ success: false, message: "User exists with this email" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return new Response(
      JSON.stringify({ message: "Error signing up", success: false }),
      { status: 500 }
    );
  }
}
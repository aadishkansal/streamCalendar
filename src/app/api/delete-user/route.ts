import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import Project from "@/model/Project"; 
import bcrypt from "bcryptjs";

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const { password, confirmPassword } = await req.json();

    // Validate required fields
    if (!password || !confirmPassword) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Password and confirm password are required" 
        }),
        { status: 400 }
      );
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Passwords do not match" 
        }),
        { status: 400 }
      );
    }

    // Find the user in database
    const dbUser = await UserModel.findById(user._id);
    if (!dbUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Invalid password" 
        }),
        { status: 401 }
      );
    }

    // Delete all related projects first
    await Project.deleteMany({ user_id: user._id });

    // Delete the user
    await UserModel.findByIdAndDelete(user._id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User account deleted successfully" 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting user account:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Error deleting user account" 
      }),
      { status: 500 }
    );
  }
}
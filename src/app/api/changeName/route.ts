import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/User";
import { after } from "lodash";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const name = await req.json().then((data) => data.name);

    if (!name) {
      return Response.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const dbUser = await User.findById(session.user._id);

    if (!dbUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    dbUser.name = name;
    await dbUser.save();

    return Response.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing name", error);
    return Response.json(
      { success: false, message: "Error changing name" },
      { status: 500 }
    );
  }
}

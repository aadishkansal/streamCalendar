import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/User";

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

    await User.findByIdAndUpdate(session.user._id, { name });
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

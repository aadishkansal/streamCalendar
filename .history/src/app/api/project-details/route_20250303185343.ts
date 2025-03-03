import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Project from "@/model/Project";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // const session = await getServerSession(authOptions);
    // const user: User = session?.user as User;

    // if (!session || !user) {
    //   return new Response(
    //     JSON.stringify({ success: false, message: "Not authenticated" }),
    //     { status: 401 }
    //   );
    // }

    // const userId = new mongoose.Types.ObjectId(user._id);
    const userId = new mongoose.Types.ObjectId(user._id);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing playlist URL or user ID" },
        { status: 400 }
      );
    }

    const {
      title,
      url,
      datestart,
      dateEnd,
      timeSlotStart,
      timeSlotEnd,
      daysSelected,
    } = await request.json();

    if (
      !playlistId ||
      !title ||
      !datestart ||
      !dateEnd ||
      !timeSlotStart ||
      !timeSlotEnd ||
      !daysSelected
    ) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      userId,
      playlistId,
      title,
      url,
      datestart,
      dateEnd,
      timeSlotStart,
      timeSlotEnd,
      daysSelected,
      completed: false,
    });
    await project.save();

    return Response.json(
      {
        success: true,
        message: "Details stored successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing details:", error);
    return Response.json(
      { success: false, message: "Error storing details" },
      { status: 500 }
    );
  }
}

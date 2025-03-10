import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as AuthUser} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Project from "@/model/Project";
import User from "@/model/User";
import Playlist from "@/model/Playlist";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: AuthUser = session?.user as AuthUser;

    if (!session || !user) {
      return new Response(
        JSON.stringify({ success: false, message: "Not authenticated" }),
        { status: 401 }
      );
    }

    const userId = user._id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing playlist URL or user ID" },
        { status: 400 }
      );
    }

    const {
      playlistId,
      title,
      url,
      dateStart,
      dateEnd,
      timeSlotStart,
      timeSlotEnd,
      daysSelected,
    } = await request.json();

    if (
      !playlistId ||
      !title ||
      !dateStart ||
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
    
    const playList = await Playlist.findById(playlistId).select("videos");
    const streakSize = playList?.videos.length || 0; 
    const streak: Array<boolean> = Array(streakSize).fill(false);

    const project = await Project.create({
      userId,
      playlistId,
      title,
      url,
      dateStart,
      dateEnd,
      timeSlotStart,
      timeSlotEnd,
      daysSelected,
      streak,
      completed: false,
    });
    await project.save();

    const dbUser = await User.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if(!dbUser){
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    dbUser.projectIds?.push(project._id as mongoose.Types.ObjectId);
    await dbUser.save();

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

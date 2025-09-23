import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as AuthUser } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose, { Types } from "mongoose";
import { NextResponse } from "next/server";
import Project from "@/model/Project";
import User from "@/model/User";
import Playlist from "@/model/Playlist";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: AuthUser = session?.user as AuthUser;
    
    if (!session || !user || !user._id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated or user ID missing" },
        { status: 401 }
      );
    }

    // Convert to ObjectId explicitly
    const userId = new mongoose.Types.ObjectId(user._id as string);

    // ✅ Receive frontend camelCase keys
    const {
      playlistId,
      title,
      start_date,
      end_date,
      time_slot_start,
      time_slot_end,
      days_selected,
    } = await request.json();

    if (
      !playlistId ||
      !title ||
      !start_date ||
      !end_date ||
      !time_slot_start ||
      !time_slot_end ||
      !days_selected
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Fetch Playlist
    const playList = await Playlist.findOne({ playlistId }).select("videos");
    const streakSize = playList?.videos.length || 0;
    const streak: boolean[] = Array(streakSize).fill(false);

    // ✅ Map camelCase to snake_case for DB
    const project = await Project.create({
      user_id: userId,
      playlistId,
      title,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      time_slot_start,
      time_slot_end,
      days_selected,
      streak,
      completed: false,
    }) as mongoose.Document & { _id: Types.ObjectId };

    // ✅ Link project to user
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    dbUser.projectIds?.push(project._id as Types.ObjectId);
    await dbUser.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Details stored successfully",
        projectId: project._id.toString(),
        updatedProjectIds: dbUser.projectIds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error storing details:", error);
    return NextResponse.json(
      { success: false, message: "Error storing details", error },
      { status: 500 }
    );
  }
}
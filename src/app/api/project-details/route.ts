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

      const userId = new mongoose.Types.ObjectId(user._id as string);
      const body = await request.json();

      const {
        playlistId,
        title,
        start_date,
        end_date,
        days_selected,
        timeSlots,
        selectedVideos,
      } = body;

      if (!playlistId) {
        return NextResponse.json(
          { success: false, message: "Missing playlistId" },
          { status: 400 }
        );
      }

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Missing title" },
          { status: 400 }
        );
      }

      if (!start_date || !end_date) {
        return NextResponse.json(
          { success: false, message: "Missing start_date or end_date" },
          { status: 400 }
        );
      }

      if (!days_selected || days_selected.length === 0) {
        return NextResponse.json(
          { success: false, message: "Please select at least one day" },
          { status: 400 }
        );
      }

      if (!timeSlots || timeSlots.length === 0) {
        return NextResponse.json(
          { success: false, message: "Please add at least one time slot" },
          { status: 400 }
        );
      }

      if (!selectedVideos || selectedVideos.length === 0) {
        return NextResponse.json(
          { success: false, message: "Please select at least one video" },
          { status: 400 }
        );
      }

      const playList = await Playlist.findOne({ playlistId }).select("videos");
      
      if (!playList) {
        return NextResponse.json(
          { success: false, message: "Playlist not found" },
          { status: 404 }
        );
      }

      const streakSize = selectedVideos.length;
      const streak: boolean[] = Array(streakSize).fill(false);

      const formattedTimeSlots = timeSlots.map((slot: any) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      const projectData = {
        user_id: userId,
        playlistId,
        title,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        days_selected,
        timeSlots: formattedTimeSlots,
        selectedVideos,
        streak,
        completed: false,
      };

      const project = await Project.create(projectData) as mongoose.Document & { _id: Types.ObjectId };

      const dbUser = await User.findById(userId);
      
      if (!dbUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      dbUser.projectIds = dbUser.projectIds || [];
      dbUser.projectIds.push(project._id as Types.ObjectId);
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
    } catch (error: any) {
      console.error("Error in project-details:", error);
      return NextResponse.json(
        { success: false, message: "Error storing details", error: error.message },
        { status: 500 }
      );
    }
  }

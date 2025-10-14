import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import Project, { IProject } from "@/model/Project";
import User from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?._id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id as string);

    const user = await User.findById(userId).select("projectIds");
    
    if (!user || !user.projectIds || user.projectIds.length === 0) {
      return NextResponse.json(
        { success: true, message: "No projects found", projects: [] },
        { status: 200 }
      );
    }

    const projects = await Project.find({
      _id: { $in: user.projectIds },
    }).sort({ createdAt: -1 });

    const transformedProjects = projects.map((project) => {
      const projectObj = project.toObject() as IProject & { _id: mongoose.Types.ObjectId };
      
      return {
        _id: projectObj._id.toString(),
        title: projectObj.title,
        dateStart: projectObj.start_date,
        dateEnd: projectObj.end_date,
        completed: projectObj.completed,
        timeSlots: projectObj.timeSlots || [],
        selectedVideos: projectObj.selectedVideos || [],
        days_selected: projectObj.days_selected || [],
        playlistId: projectObj.playlistId,
        streak: projectObj.streak || [],
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Projects fetched successfully",
        projects: transformedProjects,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching projects",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

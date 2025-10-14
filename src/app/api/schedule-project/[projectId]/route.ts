import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Project, { IProject } from "@/model/Project";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  await dbConnect();

  try {
    const { projectId } = await params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const projectObj = project.toObject() as IProject & { _id: mongoose.Types.ObjectId };

    return NextResponse.json({
      success: true,
      project: {
        _id: projectObj._id.toString(),
        title: projectObj.title,
        playlistId: projectObj.playlistId,
        start_date: projectObj.start_date,
        end_date: projectObj.end_date,
        days_selected: projectObj.days_selected,
        timeSlots: projectObj.timeSlots || [],
        selectedVideos: projectObj.selectedVideos || [],
        streak: projectObj.streak || [],
        completed: projectObj.completed,
      },
    });
  } catch (error: any) {
    console.error("Error fetching project schedule:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching project", error: error.message },
      { status: 500 }
    );
  }
}

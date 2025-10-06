import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import Project from "@/model/Project";
import Playlist from "@/model/Playlist";
import { NextRequest } from "next/server";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { projectId } = await params;

    if (!Types.ObjectId.isValid(projectId)) {
      return Response.json(
        { success: false, message: "Invalid project ID format" },
        { status: 400 }
      );
    }

    const project = await Project.findOne({
      _id: projectId,
      user_id: user._id,
    });

    if (!project) {
      return Response.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const playlistIdString = project.playlistId;

    if (!playlistIdString) {
      return Response.json(
        { success: false, message: "Playlist ID is missing from project" },
        { status: 400 }
      );
    }

    let playlistData;
    
    if (Types.ObjectId.isValid(playlistIdString)) {
      const playlistObjectId = new Types.ObjectId(playlistIdString);
      playlistData = await Playlist.findOne({ _id: playlistObjectId }).select("videos");
    }
    
    if (!playlistData) {
      playlistData = await Playlist.findOne({ playlistId: playlistIdString }).select("videos");
    }
    
    if (!playlistData) {
      return Response.json(
        { success: false, message: "Playlist not found" },
        { status: 404 }
      );
    }

    if (!playlistData.videos || playlistData.videos.length === 0) {
      return Response.json(
        { success: false, message: "No videos found in playlist" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Generated details",
        project,
        videos: playlistData.videos,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error generating details" },
      { status: 500 }
    );
  }
}

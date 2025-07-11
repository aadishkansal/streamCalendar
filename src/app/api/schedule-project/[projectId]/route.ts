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

        if(!session || !user){
            return Response.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Await params before accessing its properties
        const { projectId } = await params;

        // Validate ObjectId format
        if (!Types.ObjectId.isValid(projectId)) {
            return Response.json(
                { success: false, message: "Invalid project ID format" },
                { status: 400 }
            );
        }

        // Try to find the project without user_id first to see if it exists
        const projectExists = await Project.findById(projectId);

        // Find project and verify ownership
        const project = await Project.findOne({
            _id: projectId,
            user_id: user._id  // Use _id instead of id
        });

        if (!project) {
            return Response.json(
                { success: false, message: "Project not found" },
                { status: 404 }
            );
        }

        const playlistId = project.playlistId;

        // Query by playlistId field (YouTube playlist ID) not by MongoDB _id
        const playlistVids = await Playlist.findOne({ playlistId: playlistId }).select("videos");

        return Response.json(
            { success: true, message: "Generated details", project: project, videos: playlistVids},
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error generating details", error);
        return Response.json(
            { success: false, message: "Error generating details" },
            { status: 500 }
        );
    }
}
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Project from "@/model/Project";
import Playlist from "@/model/Playlist";

export async function GET(req: Request){
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;

        if(!session || !user){
            return new Response(
                JSON.stringify({ success: false, message: "Not authenticated" }),
                { status: 401 }
            );
        }

        const { projectId } = req.query;

        const project = await Project.findById(projectId);
        const playlistId = project?.playlistId;

        const playlistVids = await Playlist.findById(playlistId).select("videos");

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
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Project from "@/model/Project";

export async function POST(req: Request) {
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

    const { index, projectId } = await req.json();

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

    if (!project.streak) {
      project.streak = [];
    }

    if (!project.completion_timestamps) {
      project.completion_timestamps = [];
    }

    while (project.streak.length <= index) {
      project.streak.push(false);
    }

    while (project.completion_timestamps.length <= index) {
      project.completion_timestamps.push(null);
    }

    project.streak[index] = false;
    project.completion_timestamps[index] = null;
    
    await project.save();
    
    return Response.json(
      { success: true, message: "Successfully unmarked video" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error unmarking video:", error);
    return Response.json(
      { success: false, message: "Error unmarking video" },
      { status: 500 }
    );
  }
}

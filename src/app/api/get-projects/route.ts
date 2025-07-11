import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Project from "@/model/Project";

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

        const projects = await Project.find(
            { _id: { $in: user.projectIds } }, 
        ).select("_id title start_date end_date completed").lean(); // Add .lean() here

        const transformedProjects = projects.map(project => ({
            _id: project._id.toString(), // Convert ObjectId to string
            title: project.title,
            dateStart: project.start_date.toISOString(), // Convert Date to ISO string
            dateEnd: project.end_date.toISOString(), // Convert Date to ISO string
            completed: project.completed
        }));

        return Response.json(
            { success: true, message: "Fetched projects", projects: transformedProjects},
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error getting projects", error);
        return Response.json(
            { success: false, message: "Error getting projects" },
            { status: 500 }
        );
    }
}
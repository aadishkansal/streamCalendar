import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Project from "@/model/Project";

export async function POST(req: Request){
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

        const { index, projectId } = await req.json();

        const project = await Project.findById(projectId);

        if(!project){
            return new Response(
                JSON.stringify({ success: false, message: "Project not found" }),
                { status: 404 }
            );
        }

        if(project.streak && project.streak.length > index){
            project.streak[index] = true;
            return new Response(    
                JSON.stringify({ success: true, message: "Succesfully updated" }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: false, message: "Unknown error" }),
            { status: 401 }
        );

    } catch (error) {
        console.error("Error marking video as completed", error);
        return Response.json(
            { success: false, message: "Error marking video as completed" },
            { status: 500 }
        );
    }
}
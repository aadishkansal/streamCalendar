import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Project from "@/model/Project";
import mongoose from "mongoose";

export async function GET(req: Request){
    await dbConnect();

    try {

        // const session = await getServerSession(authOptions);
        // const user: User = session?.user as User;

        // if(!session || !user){
        //     return new Response(
        //         JSON.stringify({ success: false, message: "Not authenticated" }),
        //         { status: 401 }
        //     );
        // }

        const projects = await Project.find({ _id: { $in: new mongoose.Types.ObjectId["67c6d91448f39bfc56e81215"] } });

        return Response.json(
            { success: true, message: "Error getting projects", projects: projects},
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
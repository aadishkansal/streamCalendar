import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

        const projects = await Project.find({ _id: { $in: projectIds } });

        res.json({ projects });
        
    } catch (error) {
        console.error("Error getting projects", error);
        return Response.json(
            { success: false, message: "Error getting projects" },
            { status: 500 }
        );
    }
}
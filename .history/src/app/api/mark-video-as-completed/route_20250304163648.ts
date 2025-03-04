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

        const {videoId} = await req

    } catch (error) {
        console.error("Error marking video as completed", error);
        return Response.json(
            { success: false, message: "Error marking video as completed" },
            { status: 500 }
        );
    }
}
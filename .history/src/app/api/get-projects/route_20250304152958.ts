import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(req: Request){
    await dbConnect();

    try {

        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
        
    } catch (error) {
        console.error("Error getting projects", error);
        return Response.json(
            { success: false, message: "Error getting projects" },
            { status: 500 }
        );
    }
}
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function GET(req: Request){
    await dbConnect();

    try {

        const user: User = useS
        
    } catch (error) {
        console.error("Error getting projects", error);
        return Response.json(
            { success: false, message: "Error getting projects" },
            { status: 500 }
        );
    }
}
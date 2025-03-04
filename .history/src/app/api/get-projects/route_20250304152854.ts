import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request){
    await dbConnect();

    try {
        
    } catch (error) {
        console.error("Error getting projects", error);
        return Response.json(
            { success: false, message: "Error getting projects" },
            { status: 500 }
        );
    }
}
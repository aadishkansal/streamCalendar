import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request){
    await dbConnect();

    try {
        
    } catch (error) {
        console.error("Error ", error);
        return Response.json(
            { success: false, message: "Error " },
            { status: 500 }
        );
    }
}
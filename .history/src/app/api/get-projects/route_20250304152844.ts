import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request){
    await dbConnect();

    try {
        
    } catch (error) {
        console.error("Error resending OTP", error);
        return Response.json(
            { success: false, message: "Error resending OTP" },
            { status: 500 }
        );
    }
}
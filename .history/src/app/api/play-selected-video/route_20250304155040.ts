import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const extractVideoID = (url: string) => {
    const regExp =
        /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { url } = await request.json();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;


        if (!user || !session) {
            return Response.json(
                { success: false, message: "Not Authenticaated" },
                { status: 401 }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'OTP successfully sent. Check your mail inbox',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error playing video", error);
        return Response.json(
            { success: false, message: "Error playing video" },
            { status: 500 }
        );
    }
}

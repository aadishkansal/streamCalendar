import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameQuerySchema } from "@/schemas/usernameQuerySchema";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const queryParams = {
          username: searchParams.get("username"),
        };

        const result = usernameQuerySchema.safeParse(queryParams);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                success: false,
                message:
                    usernameErrors?.length > 0
                    ? usernameErrors.join(", ")
                    : "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const {username} = result.data;
        const normalizedUsername = username.toLowerCase();

        const existingVerifiedUser = await UserModel.findOne({
            username: normalizedUsername,
        })

        if (existingVerifiedUser) {
            return Response.json(
              {
                success: false,
                message: "Username is already taken",
              },
              { status: 200 }
            );
        }
        return Response.json(
          {
            success: true,
            message: "Username is unique",
          },
          { status: 200 }
        );

    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json(
          {
            success: false,
            message: "Error checking username",
          },
          { status: 500 }
        );
    }
}
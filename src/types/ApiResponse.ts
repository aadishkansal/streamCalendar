import { IProject } from "@/model/Project";
import { IUser } from "@/model/User"

export interface ApiResponse{
    success: boolean,
    message: string,
    posts?: Array<IProject>,
    users?: Array<IUser>,
    friends? : Array<IUser>
};
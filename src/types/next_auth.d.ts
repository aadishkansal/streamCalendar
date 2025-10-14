import 'next-auth';
import { DefaultSession } from "next-auth";
import { Types } from "mongoose";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    email?: string;
    projectIds?: Types.ObjectId[];
  }

  interface Session {
    user: {
      _id?: string;
      name?: string;
      username?: string;
      email?: string;
      projectIds?: Types.ObjectId[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    email?: string;
    projectIds?: Types.ObjectId[];
  }
}

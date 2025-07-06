import 'next-auth';
import { DefaultSession } from 'next-auth';
import { Types } from 'mongoose';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      name?: string;
      username?: string;
      projectIds?: Types.ObjectId[];
    };
  }

  interface User {
    _id?: string;
    name?: string;
    username?: string;
    projectIds?: Types.ObjectId[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    name?: string;
    username?: string;
    projectIds?: Types.ObjectId[];
  }
}
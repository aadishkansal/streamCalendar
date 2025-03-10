import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      projectIds?: Types.ObjectId[];
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    username?: string;
    projectIds?: Types.ObjectId[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username?: string;
    projectIds?: Types.ObjectId[];
  }
}

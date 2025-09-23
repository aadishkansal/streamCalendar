import User from "@/model/User";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await dbConnect();

          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("Invalid credentials");
          }

          if (user.provider && user.provider === "google") {
            throw new Error(
              "This account uses Google sign-in. Please log in with Google."
            );
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password || ""
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            username: user.username,
            projectIds: user.projectIds,
          };
        } catch (err: any) {
          console.error("Authorization error:", err);
          throw new Error("Unable to log in");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          let existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            existingUser.name = user.name || existingUser.name;
            existingUser.provider = existingUser.provider || account.provider;
            existingUser.providerId =
              existingUser.providerId || account.providerAccountId;
            await existingUser.save();
          } else {
            await User.create({
              name: user.name,
              username: user.name,
              email: user.email,
              projectIds: [],
              provider: account.provider,
              providerId: account.providerAccountId,
              forgotPassCode: null,
              forgotPassCodeExpiry: null,
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) return url;
      } catch (error) {
        console.log("Invalid URL in redirect:", url);
      }

      return `${baseUrl}/dashboard`;
    },

    async jwt({ user, token, account, trigger, session }) {
      if (user) {
        if (account?.provider === "google") {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token._id = dbUser._id.toString();
            token.name = dbUser.name;
            token.username = dbUser.username;
            token.email = dbUser.email;
            token.projectIds = dbUser.projectIds;
          }
        } else {
          token._id = user.id || (user as any)._id;
          token.name = user.name;
          token.email = user.email;
          token.username = user.username;
          token.projectIds = user.projectIds;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id as string,
          name: token.name as string,
          username: token.username as string,
          projectIds: token.projectIds as any[],
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

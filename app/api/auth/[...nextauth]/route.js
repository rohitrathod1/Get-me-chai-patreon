// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        await connectDb();
        if (!user.email) return false; // Stop sign-in if email missing

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // Create new user with lowercase username
          await User.create({
            email: user.email,
            username: user.name
              ? user.name.replace(/\s+/g, "").toLowerCase()
              : user.email.split("@")[0],
          });
        }
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },

    async session({ session }) {
      try {
        await connectDb();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.name = dbUser.username; // Use username from DB
        }
        return session;
      } catch (err) {
        console.error("Session error:", err);
        return session;
      }
    },
  },

  pages: {
    signIn: "/login", // Custom login page
    error: "/auth/error", // Custom error page
  },

  secret: process.env.NEXTAUTH_SECRET, // Required for Vercel live
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

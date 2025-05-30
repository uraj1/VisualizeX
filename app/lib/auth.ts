import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", required: true },
        password: { label: "password", type: "password", required: true },
      },

      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        try {
          const isExistingUser = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
          if (!isExistingUser) return null;
          const passMatch = await compare(
            credentials?.password as string,
            isExistingUser.password!
          );
          if (!passMatch) return null;
          return {
            id: isExistingUser.id.toString(),
            name: isExistingUser.name,
            email: isExistingUser.email,
          };
        } catch (e) {
          return null;
        }
      },
    }),
    GoogleProvider({
      //! -> says ts that i will give thhe values definately
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email || session.user.email, // Use either token or session email
        },
      });

      if (user) {
        session.user.id = user.id;
      } else {
        console.log("User not found in the database");
      }
      return session;
    },
    async signIn({ account, profile, session, token }: any) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("No Profile");
        }
        const user = await prisma.user.upsert({
          where: {
            email: profile.email,
          },
          create: {
            name: profile.name,
            email: profile.email,
          },
          update: {
            //If user changes google name, it will reflect in the db also
            name: profile.name,
          },
        });
        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

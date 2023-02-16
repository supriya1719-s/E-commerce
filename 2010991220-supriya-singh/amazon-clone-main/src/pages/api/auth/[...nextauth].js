import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";

const authOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, token, user }) {
      session = {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
      };
      return session;
    },
  },
  providers: [
    google({
      clientId:
        "440226564974-upk3ite065cc7mbrpkjma0ok292cddj2.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export { authOptions };

export default NextAuth(authOptions);

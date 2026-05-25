import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const isGoogleAuthEnabled = Boolean(
  googleClientId && googleClientSecret
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      try {
        const id = token.id as string | undefined;
        if (id) {
          const row = await prisma.user.findUnique({
            where: { id },
            select: { name: true, email: true, image: true },
          });
          if (row) {
            session.user.name = row.name ?? session.user.name;
            session.user.email = row.email;
            if (row.image) session.user.image = row.image;
          }
        }
      } catch {
        // DB unavailable — keep JWT-backed session fields
      }
      return session;
    },
  },
  providers: [
    ...(isGoogleAuthEnabled
      ? [
          GoogleProvider({
            clientId: googleClientId!,
            clientSecret: googleClientSecret!,
            // Confidential client (has secret): state-only avoids PKCE cookie
            // mismatches that cause "Invalid code verifier" in local dev.
            checks: ["state"],
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
});

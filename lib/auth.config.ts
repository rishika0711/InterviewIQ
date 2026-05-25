import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/practice") ||
        pathname.startsWith("/history") ||
        pathname.startsWith("/profile");

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (
        isLoggedIn &&
        (pathname === "/login" || pathname === "/register")
      ) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

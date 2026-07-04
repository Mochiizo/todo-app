import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PUBLIC_PATHS = ["/login"];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isPublic =
        PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/api/auth");

      if (!auth?.user && !isPublic) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Non authentifié." },
            { status: 401 }
          );
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (auth?.user && pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return true;
    },
  },
});

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

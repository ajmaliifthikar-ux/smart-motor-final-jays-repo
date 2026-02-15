import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const authConfig = {
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === "ADMIN") return true;
                return false;
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id || '';
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Return null here because we can't use Prisma in Edge.
                // The real authorize logic stays in auth.ts (Node runtime).
                return null;
            },
        }),
    ],
} satisfies NextAuthConfig

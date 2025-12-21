import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

import Resend from "next-auth/providers/resend";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { sendVerificationRequest } from "@/lib/authSendRequest";

type Credentials = {
    email: string;
    name?: string;
    password: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCredentials(raw: any): Credentials {
    if (typeof raw?.email === "string" && typeof raw?.password === "string") {
        return {
            email: raw.email,
            name: typeof raw.name === "string" ? raw.name : undefined,
            password: raw.password,
        };
    }
    throw new Error("Credenciais inválidas");
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
    return {
        debug: true,
        theme: { logo: "https://authjs.dev/img/logo-sm.png" },
        adapter: PrismaAdapter(prisma),
        providers: [
            Resend({
                from: "faleconosco@kaizin.com.br",
                maxAge: 10 * 60, // 10 minutos
                generateVerificationToken: async () => {
                    return Math.floor(
                        100000 + Math.random() * 900000
                    ).toString();
                },
                sendVerificationRequest,
                
            }),
            CredentialsProvider({
                name: "credentials",
                id: "credentials-password",
                credentials: {
                    email: { label: "Email", type: "email" },
                    name: { label: "Name", type: "name" },
                    password: { label: "Password", type: "password" },
                },
                async authorize(credentials) {
                    const creds = parseCredentials(credentials);
                    if (!creds?.email || !creds?.password) return null;

                    const user = await prisma.user.findFirst({
                        where: { email: creds.email },
                    });

                    if (!user) {
                        const tempUsername = `user_${Math.random()
                            .toString(36)
                            .slice(2, 10)}`;
                        const newUser = await prisma.user.create({
                            data: {
                                name: creds.name ?? creds.email,
                                email: creds.email,
                                encrypted_password: await bcrypt.hash(
                                    creds.password,
                                    10
                                ),
                                Profile: {
                                    create: {
                                        username: tempUsername,
                                        lowercased_username:
                                            tempUsername.toLowerCase(),
                                        name: creds.name ?? creds.email,
                                        bio: "",
                                        avatar_url: "",
                                    },
                                },
                            },
                        });

                        return {
                            id: newUser.id,
                            email: newUser.email,
                            name: newUser.name,
                        };
                    }

                    if (!user.encrypted_password) {
                        throw new Error("Invalid credentials 1");
                    }
                    const isCorrectPassword = await bcrypt.compare(
                        creds.password,
                        user.encrypted_password
                    );

                    if (!isCorrectPassword) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                },
            }),
            CredentialsProvider({
                name: "otp",
                id: "credentials-otp",
                credentials: {
                    email: { label: "Email", type: "email" },
                    otp: { label: "Código", type: "text" },
                },
                async authorize(credentials) {
                    if (!credentials?.email || !credentials?.otp) return null;

                    const email = credentials.email as string;
                    const otp = credentials.otp as string;

                    const tokenRecord = await prisma.tokenOTP.findUnique({
                        where: { identifier: email },
                    });

                    if (
                        !tokenRecord ||
                        tokenRecord.token !== otp ||
                        new Date() > tokenRecord.expires
                    ) {
                        throw new Error("Código inválido ou expirado.");
                    }

                    await prisma.tokenOTP.delete({
                        where: { identifier: email },
                    });

                    let user = await prisma.user.findFirst({
                        where: { email },
                    });

                    if (!user) {
                        const tempUsername = `user_${Math.random()
                            .toString(36)
                            .slice(2, 10)}`;
                        const newUser = await prisma.user.create({
                            data: {
                                name: tempUsername,
                                email: email,
                                Profile: {
                                    create: {
                                        username: tempUsername,
                                        lowercased_username:
                                            tempUsername.toLowerCase(),
                                        name: email,
                                        bio: "",
                                        avatar_url: "",
                                    },
                                },
                            },
                        });

                        return {
                            id: newUser.id,
                            email: newUser.email,
                            name: newUser.name,
                        };
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                },
            }),
        ],
        pages: {
            signIn: "/login",
            newUser: "/new-user",
        },
        session: { strategy: "jwt" },

        secret: process.env.AUTH_SECRET,
        callbacks: {
            authorized({ request, auth }) {
                const { pathname } = request.nextUrl;
                if (pathname === "/middleware-example") return !!auth;
                return true;
            },
            jwt({ token, trigger, session, account, user }) {
                if (user && (user as any).id) token.id = (user as any).id;

                if (trigger === "update") token.name = session.user.name;
                if (account?.provider === "keycloak") {
                    return { ...token, accessToken: account.access_token };
                }

                return token;
            },
            async session({ session, token }) {
                if (token?.accessToken) session.accessToken = token.accessToken;

                const userId = (token as any).id ?? (token as any).sub;
                if (userId) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (session.user as any).id = userId as string;
                }
                return session;
            },
        },
        experimental: { enableWebAuthn: true },
    };
});

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        // ensure session.user has an optional id
        user?: {
            id?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;
    }
}

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Edge-safe proxy that checks for a valid next-auth token and redirects
// unauthenticated users to the sign-in page for protected routes.
// This file must NOT import `auth` or other Node-only modules (like prisma)
// because it runs in the Edge runtime.

export async function proxy(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow next static, api, auth routes and assets through
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/static") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Define aqui as rotas que você quer proteger
    const protectedPaths = ["/protected", "/dashboard"];
    const isProtected = protectedPaths.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    if (isProtected && !token) {
        const signInUrl = new URL("/auth/signin", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/protected/:path*", "/dashboard"],
};

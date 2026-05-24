import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

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

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const protectedPaths = ["/protected", "/dashboard", "/settings", "/account", "/edit"];
    const isProtected = protectedPaths.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    if (pathname === "/" && session) {
        const homeUrl = new URL("/home", request.url);
        return NextResponse.redirect(homeUrl);
    }

    if (isProtected && !session) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/protected/:path*", "/dashboard", "/settings", "/account", "/account/:path*", "/edit"],
};
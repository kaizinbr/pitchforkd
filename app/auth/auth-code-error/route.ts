import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    
    return NextResponse.redirect(`${origin}/error?code=auth-code-error&message=Erro%20ao%20autenticar%20com%20o%20Google`);
}

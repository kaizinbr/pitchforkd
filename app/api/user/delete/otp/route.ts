import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);
import { DeleteEmail } from "@/components/mail/email-template";


import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    // const { email } = await request.json();
    const session = await auth();

    try {

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        if (!session.user.email) {
            return NextResponse.json(
                { error: "User email not found" },
                { status: 400 },
            );
        }

        const otpToken = Math.floor(100000 + Math.random() * 900000).toString();

        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

        const existingToken = await prisma.tokenOTP.findUnique({
            where: { identifier: session.user.email },
        });

        if (existingToken) {
            // se já existe, sobrescrever e enviar o novo
            await prisma.tokenOTP.update({
                where: { identifier: session.user.email },
                data: {
                    token: otpToken,
                    expires,
                },
            });
        } else {
            await prisma.tokenOTP.create({
                data: {
                    token: otpToken,
                    identifier: session.user.email,
                    expires,
                },
            });
        }

        const { data, error } = await resend.emails.send({
                    from: "Whistle <onboarding@kaizin.com.br>",
                    to: session.user.email,
                    subject: "Confirme seu e-mail para continuar",
                    react: DeleteEmail({ token: otpToken }),
                });
        
                if (error) {
                    return NextResponse.json({ error }, { status: 500 });
                }

        return NextResponse.json(
            { message: "Token enviado com sucesso" },
            { status: 200 },
        );
    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 },
        );
    }
}

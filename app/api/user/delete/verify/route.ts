import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);
import { ChangeEmail } from "@/components/mail/email-template";



import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    const { otp } = await request.json();
    const session = await auth();

    try {
        if (!otp) {
            return NextResponse.json(
                { error: "OTP is required" },
                { status: 400 },
            );
        }

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

        const existingToken = await prisma.tokenOTP.findUnique({
            where: { identifier: session.user.email },
        });

        if (!existingToken || existingToken.token !== otp) {
            return NextResponse.json(
                { error: "O código OTP é inválido" },
                { status: 400 },
            );
        }

        if (existingToken.expires < new Date()) {
            return NextResponse.json(
                { error: "O código OTP expirou" },
                { status: 400 },
            );
        }

        if (otp === existingToken.token) {
            // Atualizar o e-mail do usuário

            // Deletar o token OTP após o uso
            await prisma.tokenOTP.deleteMany({
                where: { identifier: session.user.email },
            });

            const verificationToken = bcrypt.hashSync(
                session.user.email + Date.now().toString(),
                10,
            );

            await prisma.verificationToken.create({
                data: {
                    identifier: session.user.email,
                    token: verificationToken,
                    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
                    action: "DELETE_ACCOUNT",
                },
            });

            return NextResponse.json(
                { message: "Email verificado e atualizado com sucesso", token: verificationToken },
                { status: 200 },
            );
        }


    } catch (err) {
        console.error("fetch error", err);
        return NextResponse.json(
            { error: "Falha ao atualizar o e-mail" },
            { status: 500 },
        );
    }
}

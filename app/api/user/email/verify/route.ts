import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);
import { ChangeEmail } from "@/components/mail/email-template";


import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    const { otp, email } = await request.json();
    const session = await auth();

    try {
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 },
            );
        }

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

        const existingToken = await prisma.tokenOTP.findUnique({
            where: { identifier: email },
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
            await prisma.user.update({
                where: { id: session.user.id },
                data: { email: email, emailVerified: new Date() },
            });

            // Deletar o token OTP após o uso
            await prisma.tokenOTP.deleteMany({
                where: { identifier: email },
            });

            return NextResponse.json(
                { message: "Email verificado e atualizado com sucesso" },
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

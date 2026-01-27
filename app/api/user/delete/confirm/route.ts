import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
const resend = new Resend(process.env.AUTH_RESEND_KEY);


import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    const { token } = await request.json();
    const session = await auth();

    try {
        if (!token) {
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

        const existingToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: session.user.email,
                action: "DELETE_ACCOUNT",
            },
        });

        if (!existingToken || existingToken.token !== token) {
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

        if (token === existingToken.token) {
            // deletar usuario
            await prisma.user.delete({
                where: { email: session.user.email },
            });

            console.log("Deleting user account for:", session.user.email);

            // Deletar o token OTP após o uso
            await prisma.verificationToken.deleteMany({
                where: { identifier: session.user.email, action: "DELETE_ACCOUNT" },
            });


            return NextResponse.json(
                { message: "Conta deletada com sucesso" },
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

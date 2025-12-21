import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email é obrigatório" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                email: true,
                encryptedPassword: true,
                accounts: {
                    select: {
                        provider: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({
                exists: false,
                message: "Nenhuma conta encontrada com este email",
            });
        }

        const hasPassword = !!user.encryptedPassword;
        const oauthProviders = user.accounts.map((acc) => acc.provider);

        if (!hasPassword && oauthProviders.length > 0) {
            return NextResponse.json({
                exists: true,
                hasPassword: false,
                providers: oauthProviders,
                message: `Esta conta foi criada com ${oauthProviders.join("/")}. Use esse método para entrar ou adicione uma senha nas configurações.`,
            });
        }

        return NextResponse.json({
            exists: true,
            hasPassword,
            providers: oauthProviders,
            canLoginWithPassword: hasPassword,
        });
    } catch (error) {
        console.error("Error checking login method:", error);
        return NextResponse.json(
            { error: "Erro ao verificar método de login" },
            { status: 500 }
        );
    }
}

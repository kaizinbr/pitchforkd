import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { oneTimeTokenClient } from "better-auth/client/plugins";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// const prisma = new prisma();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    oneTimeToken: {
        enabled: true,
        tokenLength: 6, // default is 32
        tokenCharset: "numeric", // default is "alphanumeric"
        tokenExpiration: 10 * 60, // 10 minutes in seconds, default is 15 minutes
    },
    // account: {
    //     modelName: "ba_account",
    // },
    session: {
        modelName: "session",
    },
    advanced: {
        database: {
            generateId: "uuid", // or "cuid", "ulid", ...etc
        },
    },
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: { 
            clientId: process.env.AUTH_GOOGLE_ID as string, 
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string, 
        }, 
    },
    account:{
        accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github", "email-password"], // or async (request) => ["google", "github"]
			allowDifferentEmails: false
		},
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in") {
                    try {
                        // 3. Aqui você dispara o e-mail usando o Resend
                        await resend.emails.send({
                            from: "Acme <onboarding@kaizin.work>", // Coloque o seu domínio verificado aqui
                            to: email,
                            subject:
                                type === "sign-in"
                                    ? "Seu código de acesso"
                                    : "Verifique seu e-mail",
                            html: `
                            <h2>Olá!</h2>
                            <p>Seu código de verificação é: <strong>${otp}</strong></p>
                            <p>Ele expira em alguns minutos.</p>
                        `,
                        });
                        console.log(`E-mail enviado com sucesso para ${email}`);
                    } catch (error) {
                        console.error(
                            "Erro ao enviar o e-mail pelo Resend:",
                            error,
                        );
                        // Opcional: você pode jogar um erro aqui para o frontend saber que falhou
                    }
                } else if (type === "email-verification") {
                    // Send the OTP for email verification
                } else {
                    // Send the OTP for password reset
                }
            },
        }),
        nextCookies(),
    ],
    trustedOrigins: [
        // "*",
        "myapp://",
        "firstapp://",
        // Development mode - Expo's exp:// scheme with local IP ranges
        ...(process.env.NODE_ENV === "development"
            ? [
                  "exp://", // Trust all Expo URLs (prefix matching)
                  "exp://**", // Trust all Expo URLs (wildcard matching)
                  "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path

                  "firstapp://",
              ]
            : []),
    ],
    databaseHooks: {
        user: {
            create: {
                // before: null,
                after: async (user) => {
                    //perform additional actions, like creating a stripe customer
                    console.log("User created:", user);

                    const tempUsername = `user_${Math.random()
                        .toString(36)
                        .slice(2, 10)}`;

                    await prisma.profile.create({
                        data: {
                            id: user.id, // mesmo id do User
                            avatarUrl: user.image || "https://zf4goehfa7fevldb.public.blob.vercel-storage.com/default.jpg",
                            username: tempUsername,
                            lowername: tempUsername.toLowerCase(),
                            name: user.name || user.email || "Usuário",
                            bio: "",
                            public: false,
                        },
                    });
                },
            },
        },
    },
});

"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { generateFromEmail, generateUsername } from "unique-username-generator";

export const signUpAction = async (formData: FormData) => {
    const nome = formData.get("nome")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    console.log(origin);

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/sign-up",
            "Preencha os campos de email e senha"
        );
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}`,
            data: {
                name: nome,
            }
        },
    });

    // define dados temporarios de perfil para evitar erros pela expiração do link de confirmação
    const tempUsername = generateUsername("", 0, 15);
    const tempName = generateUsername("", 0, 15);
    console.log("Your temporary data:", tempUsername, tempName);

    const { data, error: setProfileError } = await supabase
        .from("profiles")
        .insert({
            id: user!.id,
            username: tempUsername,
            lowercased_username: tempUsername,
            name: nome,
        });

    if (setProfileError) {
        console.log(setProfileError);
    }

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    } else {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Deu certo, obrigado! Verifique seu email para confirmar sua conta."
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Preencha o campo Email"
        );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Erro ao enviar email de redefinição de senha"
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Verifique seu email para redefinir sua senha"
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Preencha os campos de senha"
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "As senhas não coincidem"
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        // console.error(error);
        if (error.code == "422") {
            encodedRedirect(
                "error",
                "/protected/reset-password",
                "Sua nova senha deve ser diferente da anterior"
            );
        } else {
            encodedRedirect(
                "error",
                "/protected/reset-password",
                "Falha ao redefinir senha, tente utilizar uma senha diferente da anterior"
            );
        }
    }

    encodedRedirect(
        "success",
        "/protected/reset-password",
        "Senha redefinida com sucesso"
    );
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

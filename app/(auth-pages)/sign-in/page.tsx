import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-neutral-700">
                <h1 className="text-2xl font-bold">Entre com sua conta</h1>
                <p className="text-sm text-neutral-300">
                    Não tem uma conta?{" "}
                    <Link
                        className="text-neutral-300 font-medium underline"
                        href="/sign-up"
                    >
                        Cadastre-se
                    </Link>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="wjsn@vacas.com" required />
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">Senha</Label>
                        <Link
                            className="text-xs text-neutral-300 underline"
                            href="/forgot-password"
                        >
                            Esqueci a senha
                        </Link>
                    </div>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        required
                    />
                    <SubmitButton
                        className="rounded-xl bg-amber-600"
                        pendingText="Entrando..."
                        formAction={signInAction}
                    >
                        Entrar
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
            </form>
        </div>
    );
}

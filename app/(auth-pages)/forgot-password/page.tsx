import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-neutral-800">
                <div>
                    <h1 className="text-2xl font-bold">Redefinir senha</h1>
                    <p className="text-sm text-neutral-300">
                        Lembra da senha?{" "}
                        <Link
                            className="text-neutral-300 font-medium underline"
                            href="/sign-in"
                        >
                            Entre por aqui
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <SubmitButton className="rounded-xl bg-amber-600" formAction={forgotPasswordAction}>
                        Redefinir senha
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
            </form>
        </div>
    );
}

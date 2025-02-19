import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = {
    title: "Redefinição de senha | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function ResetPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full max-w-2xl min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-bunker-800 ">
                <h1 className="text-2xl font-bold">Redefinição de senha</h1>
                <p className="text-sm text-neutral-300">
                    Preencha sua nova senha abaixo
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="password">Nova senha</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Nova senha"
                        required
                    />
                    <Label htmlFor="confirmPassword">
                        Confirme a nova senha
                    </Label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a nova senha"
                        required
                    />
                    <SubmitButton
                        className="rounded-xl text-center !font-medium bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 transition-all duration-200"
                        pendingText="Redefinindo..."
                        formAction={resetPasswordAction}
                    >
                        Redefinir senha
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
            </form>
        </div>
    );
}

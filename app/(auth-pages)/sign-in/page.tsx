// app/login/page.tsx (Exemplo)
import { signIn } from "@/auth";

export default function SignIn() {
    return (
        <form
            action={async (formData) => {
                "use server";
                await signIn("credentials", formData);
            }}
        >
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 block mb-2"
            />
            <input
                type="password"
                name="password"
                placeholder="Senha"
                className="border p-2 block mb-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2">
                Entrar
            </button>
        </form>
    );
}

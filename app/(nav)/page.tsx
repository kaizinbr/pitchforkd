import Link from "next/link";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-6 px-4 h-lvh justify-center items-center">
                <div className="flex flex-col gap-6 items-center">
                    <h1 className="text-xl font-semibold text-center">
                        Entre ou crie uma conta para avaliar seus álbuns
                        favoritos!
                    </h1>
                    <div className="flex gap-2">
                        <button className="py-2 px-4 rounded-lg border-2 border-orange-600">
                            <Link href="/sign-in">Entrar</Link>
                        </button>
                        <button className="py-2 px-4 rounded-lg bg-orange-600 border-2 border-orange-600">
                            <Link href="/sign-up">Cadastrar</Link>
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

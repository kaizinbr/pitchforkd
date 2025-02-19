import Link from "next/link";

export default async function Home() {
    return (
        <>
            <main className="flex-1 flex flex-col gap-6 px-4 h-lvh justify-center items-center">
                <div className="flex flex-col gap-6 items-center justify-center min-h-[calc(100vh-5rem)]">
                    <h1 className="text-xl font-semibold text-center">
                        Comece a avaliar seus álbuns favoritos!
                    </h1>
                    <div className="flex gap-2 flex-col">

                        <Link
                            className="py-2 px-8 rounded-xl text-lg text-center font-semibold bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 transition-all duration-200"
                            href="/sign-up"
                        >
                            Cadastrar
                        </Link>
                        <Link
                            className="py-2 px-8 rounded-xl text-lg text-center font-semibold border-2 border-main-500 hover:bg-main-600 hover:border-main-600 transition-all duration-200"
                            href="/sign-in"
                        >
                            Entrar
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}

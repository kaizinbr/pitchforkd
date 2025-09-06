import SearchLayout from "@/components/Search/search";

type Props = {
    params: Promise<{ query: string }>;
    children: React.ReactNode;
};

export default async function Layout({ params, children }: Props) {
    const query = (await params).query;

    // Buscar dados do usuário
    

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <SearchLayout query={query} />

            {/* Conteúdo da página ativa */}
            <div className="w-full max-w-2xl mt-36 md:mt-52">
                {children}
            </div>
        </div>
    );
}
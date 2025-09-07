import SearchLayout from "@/components/Search/search";

type Props = {
    params: Promise<{ query: string }>;
    children: React.ReactNode;
    searchParams?: Promise<{
        query?: string;
        page?: string;
        tab?: string;
    }>
};

export default async function Layout({ params, children, searchParams }: Props) {
    const paramsData = await params;
    const initialQuery = paramsData.query;

    const searchParamsData = await searchParams;
    const query = searchParamsData?.query || initialQuery || "";
    const tab = searchParamsData?.tab || "albums"; // 1 = albums, 4 = reviews, 2 = musicas (tracks), 3 = perfis (profiles)
    

    return (
        <div className="flex flex-col gap-4 items-center relative">
            <SearchLayout query={query} tab={tab} />

            {/* Conteúdo da página ativa */}
            <div className="w-full max-w-2xl mt-36 md:mt-52">
                {children}
            </div>
        </div>
    );
}
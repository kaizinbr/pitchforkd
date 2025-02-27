import Search from "@/components/Search/search-bar";

import Results from "@/components/Search/results";

export const metadata = {
    title: "Pesquisa | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        tab?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const tab = searchParams?.tab || "1"; // 1 = albums, 4 = reviews, 2 = musicas (tracks), 3 = perfis (profiles)
    const currentPage = Number(searchParams?.page) || 1;


    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center  mx-auto max-w-2xl p-5 md:mt-16">
            <Search placeholder="Pesquisar..." />
            <Results query={query} currentPage={currentPage} tab={tab} />
        </div>
    );
}
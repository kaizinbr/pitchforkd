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
    // const supabase = createClient();

    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const tab = searchParams?.tab || "a"; // a = albums, r = reviews, m = musicas (tracks), p = perfis (profiles)
    const currentPage = Number(searchParams?.page) || 1;


    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center  mx-auto max-w-2xl p-5 md:mt-16">
            <Search placeholder="Pesquisar..." />
            <Results query={query} currentPage={currentPage} />
        </div>
    );
}
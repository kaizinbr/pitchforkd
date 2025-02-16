import Search from "@/components/Search/search-bar";

import Results from "@/components/Search/results";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    // const supabase = createClient();

    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;


    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center  mx-auto max-w-4xl p-5 mt-16">
            <Search placeholder="Pesquisar..." />
            <Results query={query} currentPage={currentPage} />
        </div>
    );
}
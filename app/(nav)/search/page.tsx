import Search from "@/components/Search/search-bar";

import Results from "@/components/Search/results";
import Link from "next/link";

export const metadata = {
    title: "Pesquisa | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page() {


    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center  mx-auto max-w-2xl py-5 md:mt-16">
            <Search placeholder="Pesquisar..." />
            {/* <div className="w-full max-w-2xl mt-36 md:mt-52">
                <Link href={`/releases`} className="text-blue-500 hover:underline">
                    Lançamentos recentes
                </Link>
            </div> */}
        </div>
    );
}
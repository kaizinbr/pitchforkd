import Search from "@/components/Search/search-bar";

import Results from "@/components/Search/results";
import Link from "next/link";
import ReleasesPage from "@/components/explore/releases";

export const metadata = {
    title: "Lançamentos | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page() {


    return (
        <div className="flex-1 w-full flex flex-col items-center  mx-auto max-w-2xl px-2 py-5 md:mt-16">
            <ReleasesPage />
        </div>
    );
}
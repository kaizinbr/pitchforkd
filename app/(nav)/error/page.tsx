import ErrorPage from "@/components/error";

export const metadata = {
    title: "Erro | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};


export default async function Error() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col w-full h-full m-auto justify-center items-center px-8 max-w-md gap-2">
                <ErrorPage />
            </div>
        </div>
    );
}
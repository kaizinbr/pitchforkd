import RatePage from "@/components/rate/RatePage";

export const metadata = {
    title: "Avaliar álbum | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return (
        <div className="flex flex-col gap-4 items-center px-5">
            <RatePage id={id} />
        </div>
    );
}
import ArtistPage from "@/components/artist/artist-page";

export const metadata = {
    title: "Artista | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return (
        <div>
            <ArtistPage id={id} />
        </div>
    );
}

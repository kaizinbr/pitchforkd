import ArtistPage from "@/components/artist/artist-page";

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

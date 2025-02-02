import AlbumPage from "@/components/album/AlbumPage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return (
        <div>
            <AlbumPage id={id} />
        </div>
    );
}

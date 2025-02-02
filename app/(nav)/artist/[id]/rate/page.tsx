import RatePage from "@/components/rate/RatePage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return (
        <div>
            <RatePage id={id} />
        </div>
    );
}
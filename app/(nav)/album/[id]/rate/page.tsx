import RatePage from "@/components/rate/RatePage";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const id = (await params).id;
    return (
        <div className="flex flex-col gap-4 items-center relative">
            <RatePage id={id} />
        </div>
    );
}
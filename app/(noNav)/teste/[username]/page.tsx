import { auth } from "auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Index({ params }: { params: { username: string } }) {

    const session = await auth()
    
    const { username } = await params;
    console.log("Username param:", username);

    if (!username) {
        return <div>Username is required</div>;
    }

    const user = await prisma.profile.findFirst({
        where: { username: username },
        include: {
            Rating: true,
        },
    });
    // console.log("Fetched user:", user);

    return (
        <div className="flex flex-col gap-6">
            
            <div className="flex flex-col rounded-md bg-neutral-700">
                <div className="rounded-t-md bg-neutral-600 p-4 font-bold">
                    Current Session
                </div>
                <pre className="whitespace-pre-wrap break-all px-4 py-6">
                    {JSON.stringify(session, null, 2)}
                </pre>
            </div>
        </div>
    );
}

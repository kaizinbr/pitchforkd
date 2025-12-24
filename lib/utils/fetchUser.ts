'use server'
import { auth } from "@/auth";

export async function fetchUser() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        console.error("User not logged in");
        return;
    }

    return user;
};

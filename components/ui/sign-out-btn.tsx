"use client";
import { signOut } from "next-auth/react";
import { Trash, LockKeyhole, LogOut, Mail } from "lucide-react";

export function SignOut() {
    return (
        <button
            className="w-full cursor-pointer items-center gap-2 flex flex-row py-3 px-4 text-red-400 bg-transparent hover:bg-shark-800 transition duration-200"
            onClick={() => signOut({ redirectTo: "/" })}
        >
            <LogOut size={16} />

            <span>Sair</span>
        </button>
    );
}

"use client";
import { signOut } from "next-auth/react";
import { Trash, LockKeyhole, LogOut, Mail } from "lucide-react";

export function SignOut() {
    return (
        <button
            className="w-full cursor-pointer gap-2 flex flex-row p-4 text-red-500 bg-transparent hover:bg-shark-700 transition duration-200"
            onClick={() => signOut({ redirectTo: "/" })}
        >
            <LogOut size={18} />

            <span>Sair</span>
        </button>
    );
}

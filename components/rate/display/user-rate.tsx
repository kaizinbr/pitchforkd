"use client";
import { Review } from "@/lib/utils/types";
import Avatar from "@/components/ui/Avatar";
import formatRate from "@/lib/utils/formatRate";
import Link from "next/link";
import { displayPastRelativeTime } from "@/lib/utils/time";

import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextareaDisplay from "@/components/textaera-content";

export default function UserRate({
    review,
    loading,
    likes,
}: {
    review: Review;
    loading: boolean;
    likes: number;
}) {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: review.content,
        editable: false,
        immediatelyRender: false,
    });

    return (
        <div className="w-full max-w-2xl px-5">
            {loading ? (
                <div className=""></div>
            ) : (
                <div className="flex flex-col gap-2 items-">
                    <h2 className="text-xl font-bold">
                        Avaliação de{" "}
                        <Link href={`/${review.profiles.username}`}>
                            {review.profiles.name || review.profiles.username}
                        </Link>
                    </h2>
                    <p className="text-3xl font-bold">
                        {formatRate(review.total)}
                    </p>
                    {review.review == "" ? (
                        <p className="text-bunker-300 text-sm">
                            {displayPastRelativeTime(
                                new Date(review.created_at)
                            )}
                        </p>
                    ) : (
                        <div className="p-3 w-full flex flex-col gap-3 bg-bunker-800 rounded-xl">
                            <div className="w-full flex flex-row gap-2 items-center">
                                <Link
                                    href={`/${review.profiles.username}`}
                                    className="flex relative flex-col justify-center items-center size-10 rounded-full"
                                >
                                    <Avatar
                                        size={40}
                                        src={review.profiles.avatar_url}
                                        className={"size-10"}
                                        isIcon
                                    />
                                </Link>
                                <div className="flex flex-col items-start justify-center">
                                    <Link
                                        href={`/${review.profiles.username}`}
                                        className="flex flex-row justify-start items-center gap-2 text-sm"
                                    >
                                        <p className=" font-medium">
                                            {review.profiles.name}
                                        </p>
                                        <p className="text-bunker-300 text-xs">
                                            @{review.profiles.username}
                                        </p>
                                    </Link>
                                    {review.profiles.pronouns && (
                                        <div className="flex flex-row justify-start items-center text-xs gap-2 text-bunker-400">
                                            <p className=" font-semibold">
                                                {review.profiles.pronouns}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full text-sm z-10">
                                <TextareaDisplay editor={editor} uneditable={true} />
                            </div>
                            <div className="flex items-center justify-start flex-row gap-1 text-xs text-bunker-400 ">
                                <span className=" h-full flex items-center">
                                    {displayPastRelativeTime(
                                        new Date(review.created_at)
                                    )}
                                </span>
                                <span className="">•</span>
                                <span>
                                    {likes === 1
                                        ? "1 curtida"
                                        : `${likes} curtidas`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

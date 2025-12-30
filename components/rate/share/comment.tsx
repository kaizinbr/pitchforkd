"use client";
import { Review } from "@/lib/utils/types";
import Avatar from "@/components/ui/Avatar";
import formatRate from "@/lib/utils/formatRate";
import Link from "next/link";
import { displayPastRelativeTime } from "@/lib/utils/time";

import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextareaDisplay from "@/components/textaera-content";

export default function Comment({
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
        <div className="w-full max-w-2xl z-10">
            {loading ? (
                <div className=""></div>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    
                    {review.review == "" ? (
                        <p className="text-shark-300 text-center text-[10px]">
                            {displayPastRelativeTime(
                                new Date(review.createdAt)
                            )}
                        </p>
                    ) : (
                        <div className="p-2 w-full flex flex-col  bg-shark-950 rounded-xl">
                            <div className="w-full flex flex-row gap-2 items-center mb-1.5">
                                <div className="flex relative flex-col justify-center items-center size-6">
                                    <Avatar
                                        size={24}
                                        src={review.Profile.avatarUrl}
                                        className={"size-6"}
                                        isIcon
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-center">
                                    <div className="flex flex-row justify-start items-center gap-1 max-h-3 text-[10px]">
                                        <p className=" font-medium flex flex-row items-center gap-1">
                                            {review.Profile.name}
                                            {review.Profile.verified && (
                                                <TbRosetteDiscountCheckFilled className="size-3 text-main-500" />
                                            )}
                                        </p>
                                        <p className="text-shark-300 text-[8px]">
                                            @{review.Profile.username}
                                        </p>
                                    </div>
                                    {review.Profile.pronouns && (
                                        <div className="flex flex-row justify-start items-center text-[8px] max-h-3 text-shark-400">
                                            <p className=" font-semibold">
                                                {review.Profile.pronouns}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full !text-[10px] z-10">
                                <TextareaDisplay
                                    editor={editor}
                                    uneditable={true}
                                    isShare={true}
                                    lineClamp={3}
                                />
                            </div>
                            <div className="flex items-center justify-start flex-row gap-1 text-[8px] text-shark-400 ">
                                <span className=" h-full flex items-center">
                                    {displayPastRelativeTime(
                                        new Date(review.createdAt)
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

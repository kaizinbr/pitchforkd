// https://openchangelog.com/blog/nextjs-changelog

import { Changelog } from "@openchangelog/next";
import { Suspense } from "react";

export default function ChangelogPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Changelog
                workspaceID="ws_custh74h990s5rbgv1ig"
                        changelogID="cl_custjc4h990s5rbgv220"
                // baseUrl="https://your-openchangelog-instance.com" // when self-hosting
            />
        </Suspense>
    );
}

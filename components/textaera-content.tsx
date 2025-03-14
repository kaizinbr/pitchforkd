import { RichTextEditor } from "@mantine/tiptap";
import { Review, Content } from "@/lib/utils/types";

export default function TextareaDisplay({
    editor,
    lineClamp,
    uneditable,
}: {
    editor: any;
    lineClamp?: number;
    uneditable?: boolean;
}) {
    if (uneditable) {
        return (
            <RichTextEditor
                editor={editor}
                variant="subtle"
                classNames={{
                    root: `!bg-transparent !text-sm !border-transparent !rounded-xl !w-full`,
                    content: `!bg-transparent !p-0 display-contents text-wrap break-words ${lineClamp ? "line-clamp-4" : ""}`,
                }}
            >
                <RichTextEditor.Content />
            </RichTextEditor>
        );
    }

    const content = editor.getJSON();

    if (!content) {
        return null;
    }

    // console.log(content)

    if (
        content &&
        (content as Content).content.length > 0 &&
        !(content as Content).content[0]?.content
    ) {
        return null;
    }

    return (
        <RichTextEditor
            editor={editor}
            variant="subtle"
            classNames={{
                root: `!bg-transparent !text-sm !border-transparent !rounded-xl !w-full`,
                content: `!bg-transparent !p-0 display-contents text-wrap break-words ${lineClamp ? "line-clamp-4" : ""}`,
            }}
        >
            <RichTextEditor.Content />
        </RichTextEditor>
    );
}

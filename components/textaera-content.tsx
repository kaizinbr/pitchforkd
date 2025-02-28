import { RichTextEditor } from "@mantine/tiptap";

export default function TextareaDisplay({
    editor,
    lineClamp,
}: {
    editor: any;
    lineClamp?: number;
}) {
    
    return (
        <RichTextEditor
            editor={editor}
            variant="subtle"
            classNames={{
                root: `!bg-transparent !text-sm !border-transparent !rounded-xl !w-full  overflow-hidden`,
                content: `!bg-transparent !p-0 display-contents text-wrap break-words ${lineClamp ? "line-clamp-4" : ""}`,
           }}
        >
            <RichTextEditor.Content />
        </RichTextEditor>
    );
}
// import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";

const content = "<p>Subtle rich text editor variant</p>";

export default function TextareaEditor({editor}: {editor: any}) {
    // const editor = useEditor({
    //     extensions: [StarterKit, Underline],
    //     content,
    // });

    return (
        <RichTextEditor editor={editor} variant="subtle">
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
            
        </RichTextEditor>
    );
}

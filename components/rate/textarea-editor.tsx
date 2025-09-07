// import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import { RichTextEditor } from "@mantine/tiptap";
import CharacterCount from "@tiptap/extension-character-count";
import { useState } from "react";

const limit = 2000;

// const content = "<p>Subtle rich text editor variant</p>";

export default function TextareaEditor({
    content,
    setJsonContent,
    setRawText,
}: {
    content: any;
    setJsonContent: any;
    setRawText: any;
}) {
    const [percentage, setPercentage] = useState(0);
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Strike,
            Underline,
            CharacterCount.configure({
                limit,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate({ editor }) {
            setJsonContent(editor.getJSON());
            setRawText(editor.getText());
            setPercentage(
                (editor.storage.characterCount.characters() / limit) * 100
            );
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <RichTextEditor
            editor={editor}
            variant="subtle"
            classNames={{
                toolbar:
                    "!border-b !bg-shark-800 !text-white !border-shark-600 !rounded-t-xl",
                root: "!bg-shark-800 !text-white !border-shark-800 !rounded-xl",
                content: "!bg-shark-800 ",
                controlsGroup: "!gap-2 !bg-transparent",
                control:
                    "!bg-transparent !text-white !rounded-lg transition-all duration-200 hover:!bg-shark-800 hover:!text-white data-[active=true]:!bg-shark-600",
            }}
        >
            <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
            <div
                className={`character-count ${editor.storage.characterCount.characters() === limit ? "character-count--warning" : ""}`}
            >
                <svg height="20" width="20" viewBox="0 0 20 20">
                    <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`${(percentage * 31.4) / 100} 31.4`}
                        transform="rotate(-90) translate(-20)"
                    />
                    <circle r="6" cx="10" cy="10" fill="white" />
                </svg>
                {editor.storage.characterCount.characters()} / {limit}{" "}
                caracteres
                <br />
                {editor.storage.characterCount.words()} palavras
            </div>
        </RichTextEditor>
    );
}

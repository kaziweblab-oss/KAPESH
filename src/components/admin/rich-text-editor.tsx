"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  const [html, setHtml] = useState(value);
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => setHtml(currentEditor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate min-h-44 max-w-none rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm outline-none focus:outline-none",
      },
    },
  });

  return (
    <fieldset className="block sm:col-span-2">
      <legend className="text-sm font-medium text-slate-700">{label}</legend>
      <div className="mt-1.5 overflow-hidden rounded-xl border border-slate-200">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className="rounded-lg px-3 py-1.5 text-sm font-bold hover:bg-white"
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className="rounded-lg px-3 py-1.5 text-sm italic hover:bg-white"
            aria-label="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className="rounded-lg px-3 py-1.5 text-sm hover:bg-white"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className="rounded-lg px-3 py-1.5 text-sm hover:bg-white"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className="rounded-lg px-3 py-1.5 text-sm hover:bg-white"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            className="rounded-lg px-3 py-1.5 text-sm hover:bg-white"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            className="rounded-lg px-3 py-1.5 text-sm hover:bg-white"
          >
            Redo
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} />
    </fieldset>
  );
}

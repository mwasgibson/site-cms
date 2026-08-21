"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[240px] px-3 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-slate-300">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({
  editor,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>;
}) {
  const buttons: { label: string; isActive: boolean; onClick: () => void }[] = [
    {
      label: "B",
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "I",
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "H2",
      isActive: editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "H3",
      isActive: editor.isActive("heading", { level: 3 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "•list",
      isActive: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "1.list",
      isActive: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "quote",
      isActive: editor.isActive("blockquote"),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "code",
      isActive: editor.isActive("code"),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  function handleLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.onClick}
          className={`rounded px-2 py-1 text-xs font-medium ${
            btn.isActive
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-200"
          }`}
        >
          {btn.label}
        </button>
      ))}
      <button
        type="button"
        onClick={handleLink}
        className={`rounded px-2 py-1 text-xs font-medium ${
          editor.isActive("link")
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-200"
        }`}
      >
        link
      </button>
    </div>
  );
}

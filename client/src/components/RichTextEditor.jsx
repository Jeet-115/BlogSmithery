import React, { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CustomImage from "./CustomImage";
import axiosInstance from "../utils/axiosInstance";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaHighlighter,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaImage,
  FaLink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTable,
  FaMinus,
} from "react-icons/fa";

import "./EditorStyles.css";

const toolbarBtn =
  "p-2 rounded bg-[#E0F7FA] hover:bg-[#B2EBF2] text-[#006064] transition text-base shadow-sm border border-[#00ACC1]";

const RichTextEditor = ({ content, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      CustomImage,
      Link,
      HorizontalRule,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
  if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content);
  }
}, [content]);

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploading(true);
        const { data } = await axiosInstance.post(
          "/api/posts/upload-image",
          formData
        );
        editor.chain().focus().setImage({ src: data.url, width: "100%" }).run();
      } catch (err) {
        console.error("Image upload failed:", err);
      } finally {
        setUploading(false);
      }
    };
  };

  if (!editor) return null;

  return (
    <div className="border rounded-xl bg-white shadow-md">
      <div className="flex flex-wrap gap-2 p-3 border-b bg-[#E0F7FA] rounded-t-xl">
        {[ // Buttons list
          [FaBold, () => editor.chain().focus().toggleBold().run()],
          [FaItalic, () => editor.chain().focus().toggleItalic().run()],
          [FaUnderline, () => editor.chain().focus().toggleUnderline().run()],
          [FaHighlighter, () => editor.chain().focus().toggleHighlight().run()],
          [FaHeading, () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
          [FaListUl, () => editor.chain().focus().toggleBulletList().run()],
          [FaListOl, () => editor.chain().focus().toggleOrderedList().run()],
          [FaQuoteRight, () => editor.chain().focus().toggleBlockquote().run()],
          [FaMinus, () => editor.chain().focus().setHorizontalRule().run()],
          [FaUndo, () => editor.chain().focus().undo().run()],
          [FaRedo, () => editor.chain().focus().redo().run()],
          [FaImage, handleImageUpload],
          [FaLink, () => {
            const url = prompt("Enter link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }],
          [FaAlignLeft, () => editor.chain().focus().setTextAlign("left").run()],
          [FaAlignCenter, () => editor.chain().focus().setTextAlign("center").run()],
          [FaAlignRight, () => editor.chain().focus().setTextAlign("right").run()],
          [FaTable, () => {
            const rows = parseInt(prompt("Enter number of rows (1-10):"), 10);
            const cols = parseInt(prompt("Enter number of columns (1-10):"), 10);
            if (!isNaN(rows) && !isNaN(cols) && rows > 0 && cols > 0) {
              editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
            }
          }],
        ].map(([Icon, action], i) => (
          <button
            key={i}
            type="button"
            className={toolbarBtn}
            onClick={action}
          >
            <Icon />
          </button>
        ))}
      </div>

      {editor.isActive("customImage") && (
        <div className="flex gap-4 px-4 py-2 border-b items-center bg-[#F1F8F9]">
          <label className="text-sm text-gray-600">Width:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded text-sm w-24"
            value={editor.getAttributes("customImage").width || ""}
            onChange={(e) =>
              editor.commands.updateAttributes("customImage", {
                width: e.target.value,
              })
            }
            placeholder="e.g. 300px or 50%"
          />
          <label className="text-sm text-gray-600">Height:</label>
          <input
            type="text"
            className="border px-2 py-1 rounded text-sm w-24"
            value={editor.getAttributes("customImage").height || ""}
            onChange={(e) =>
              editor.commands.updateAttributes("customImage", {
                height: e.target.value,
              })
            }
            placeholder="auto"
          />
        </div>
      )}

      {uploading && (
        <p className="text-sm text-[#00838F] italic flex items-center gap-2 px-4 py-2">
          <span className="animate-spin border-2 border-[#00ACC1] border-t-transparent rounded-full w-4 h-4"></span>
          Uploading image...
        </p>
      )}

      <EditorContent
        editor={editor}
        className="tiptap p-4 min-h-[300px] bg-white rounded-b-xl"
      />
    </div>
  );
};

export default RichTextEditor;

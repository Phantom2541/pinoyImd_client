import React, { useState } from "react";
import { EditorState } from "draft-js";
import { DocxEditor } from "../../../../../../../../../components/docx";

export default function Xray() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  return (
    <div className=" mx-auto ">
      <h1 className="text-2xl font-bold ">X-ray Result</h1>

      <DocxEditor
        editorState={editorState}
        _className="mt-3 border"
        setEditorState={setEditorState}
        _style={{
          minHeight: "200px",
          overflowY: "auto",
          maxHeight: "300px",
        }}
      />
      {/* <h1 className="text-2xl font-bold mb-4">X-ray Result</h1>

      Description
      <div>
        <label htmlFor="description" className="block text-lg font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write the x-ray description here..."
        />
      </div>

      <div>
        <label htmlFor="impression" className="block text-lg font-medium mb-2">
          Impression
        </label>
        <textarea
          id="impression"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write the x-ray impression here..."
        />
      </div> */}
    </div>
  );
}

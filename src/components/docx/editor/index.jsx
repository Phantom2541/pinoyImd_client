import React from "react";
import { Editor } from "react-draft-wysiwyg";

export default function DocxEditor({
  editorState,
  setEditorState,
  _style = {},
  _className = "",
}) {
  return (
    <Editor
      editorStyle={_style}
      wrapperClassName={`${_className} cursor-text`}
      editorState={editorState}
      onEditorStateChange={setEditorState}
    />
  );
}

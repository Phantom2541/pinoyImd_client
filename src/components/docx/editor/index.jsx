import { Editor } from "react-draft-wysiwyg";

import "./style.css";

export default function DocxEditor({
  editorState,
  setEditorState,
  _style = {},
  _className = "",
}) {
  // @kevin
  return (
    <Editor
      editorStyle={{ ..._style }}
      wrapperClassName={`${_className} cursor-text`}
      editorState={editorState}
      editorClassName="editorClassName"
      toolbarClassName="toolbarClassName"
      onEditorStateChange={setEditorState}
    />
  );
}

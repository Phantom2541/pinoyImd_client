import { Editor } from "react-draft-wysiwyg";

import "./style.css";
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
      editorClassName="editorClassName"
      toolbarClassName="toolbarClassName"
      onEditorStateChange={setEditorState}
      blockStyleFn={(block) => {
        // kunin default alignment class
        const alignment = block.getData().get("text-align");
        let alignClass = "";
        if (alignment === "center") alignClass = "rdw-center-aligned-block";
        else if (alignment === "right") alignClass = "rdw-right-aligned-block";
        else if (alignment === "justify")
          alignClass = "rdw-justify-aligned-block";
        else alignClass = "rdw-left-aligned-block";
        console.log("block", alignment);
        // balik both: custom + alignment class
        return `public-DraftStyleDefault-block  editor-block ${alignClass}`;
      }}
    />
  );
}

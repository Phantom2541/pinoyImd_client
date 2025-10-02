import { MDBContainer } from "mdbreact";
import { useCallback, useEffect, useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { DocxEditor } from "../../../../../../../../../../components/docx";

export default function TypingResult({ value = "", onChange = () => {} }) {
  // Convert findings JSON → EditorState
  const safeLoad = useCallback((raw) => {
    try {
      const parsed = JSON.parse(raw);
      return EditorState.createWithContent(convertFromRaw(parsed));
    } catch (e) {
      return EditorState.createEmpty();
    }
  }, []);

  // Local state for editor (initialize once)
  const [editorState, setEditorState] = useState(() => safeLoad(value));

  useEffect(() => {
    setEditorState(safeLoad(value));
  }, [value, safeLoad]);

  // Handle editor changes
  const handleEditorChange = (newState) => {
    setEditorState(newState); // local state only

    // Save to Redux as raw JSON string
    onChange(JSON.stringify(convertToRaw(newState.getCurrentContent())));
  };

  return (
    <MDBContainer>
      <DocxEditor
        editorState={editorState}
        setEditorState={handleEditorChange}
        _className="mt-3 border"
        _style={{
          minHeight: "250px",
          maxHeight: "250px",
          overflowY: "auto",
          padding: "8px",
        }}
        placeholder="Type here..."
      />
    </MDBContainer>
  );
}

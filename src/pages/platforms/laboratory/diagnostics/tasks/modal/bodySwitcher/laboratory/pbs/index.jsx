import { MDBContainer } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { DocxEditor } from "../../../../../../../../../components/docx";
import { useCallback, useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

export default function Pbs() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);
  const { findings } = task;

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
  const [editorState, setEditorState] = useState(() => safeLoad(findings));

  // Handle editor changes
  const handleEditorChange = (newState) => {
    setEditorState(newState); // local state only

    // Save to Redux as raw JSON string
    dispatch(
      SetTASK({
        form: task?.form,
        task: {
          ...task,
          findings: JSON.stringify(convertToRaw(newState.getCurrentContent())),
        },
      })
    );
  };

  return (
    <MDBContainer>
      <DocxEditor
        editorState={editorState}
        setEditorState={handleEditorChange}
        _className="mt-3 border"
        _style={{
          minHeight: "200px",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "8px",
        }}
        placeholder="Type here..."
      />
    </MDBContainer>
  );
}

import { MDBContainer } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { DocxEditor } from "../../../../../../../../../components/docx";
import { useCallback, useEffect, useState } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";

export default function Pbs() {
  const { task } = useSelector(({ validator }) => validator);
  const { findings } = task;

  const dispatch = useDispatch();

  // Convert raw/string → EditorState
  const safeLoad = useCallback((raw) => {
    try {
      const parsed = JSON.parse(raw);
      return EditorState.createWithContent(convertFromRaw(parsed));
    } catch (e) {
      // Empty editor with normal cursor
      return EditorState.createEmpty();
    }
  }, []);

  // Local state for editor (not in Redux)
  const [editorState, setEditorState] = useState(() => safeLoad(findings));

  // If findings changes in Redux → sync local editor
  useEffect(() => {
    setEditorState(safeLoad(findings));
  }, [findings, safeLoad]);

  return (
    <MDBContainer>
      <DocxEditor
        editorState={editorState}
        setEditorState={(newState) => {
          setEditorState(newState);

          // Save only raw JSON to Redux (serializable)
          dispatch(
            SetTASK({
              form: task?.form,
              task: {
                ...task,
                findings: JSON.stringify(
                  convertToRaw(newState.getCurrentContent())
                ),
              },
            })
          );
        }}
        _className="mt-3 border"
        _style={{
          minHeight: "200px",
          overflowY: "auto",
          maxHeight: "300px",
        }}
      />
    </MDBContainer>
  );
}

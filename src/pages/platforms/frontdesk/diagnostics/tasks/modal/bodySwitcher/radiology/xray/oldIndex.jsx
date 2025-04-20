import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import { useDispatch, useSelector } from "react-redux";
import { DocxEditor } from "../../../../../../../../../components/docx/index.js";
import {
  MDBCard,
  MDBCardBody,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import { Services } from "../../../../../../../../../services/fakeDb/index.js";

export default function Xray() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const [description, setDescription] = useState(EditorState.createEmpty());
  const [impression, setImpression] = useState(EditorState.createEmpty());
  const [activeTab, setActiveTab] = useState("results");

  const descTimeout = useRef(null);
  const impTimeout = useRef(null);

  const safeLoad = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      return EditorState.createWithContent(convertFromRaw(parsed));
    } catch (e) {
      return EditorState.createWithContent(
        ContentState.createFromText(raw || "")
      );
    }
  };

  // Load editor content on mount or when task updates
  useEffect(() => {
    if (task?.description) {
      setDescription(safeLoad(task.description));
    }
    if (task?.impression) {
      setImpression(safeLoad(task.impression));
    }
  }, [task?.description, task?.impression]);

  // Debounced auto-save
  const delayedSave = useCallback(
    (editorType, newState, timeoutRef) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const updatedTask = {
          ...task,
          [editorType]: JSON.stringify(
            convertToRaw(newState.getCurrentContent())
          ),
        };

        dispatch(
          SetTASK({
            form: task?.form,
            task: updatedTask,
          })
        );
      }, 500); // Adjust debounce delay as needed
    },
    [dispatch, task]
  );

  return (
    <div className="mx-auto">
      {Services.getName(task?.packages)}
      <MDBNav color="primary" tabs className="nav-justified">
        <MDBNavItem>
          <MDBNavLink
            link
            active={activeTab === "results"}
            to="#!"
            onClick={() => setActiveTab("results")}
          >
            Description
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            active={activeTab === "kit"}
            to="#!"
            onClick={() => setActiveTab("kit")}
          >
            Impression
          </MDBNavLink>
        </MDBNavItem>
      </MDBNav>

      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="results">
              <DocxEditor
                editorState={description}
                setEditorState={(newState) => {
                  setDescription(newState);
                  delayedSave("description", newState, descTimeout);
                }}
                _className="mt-3 border"
                _style={{
                  minHeight: "200px",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
              />
            </MDBTabPane>

            <MDBTabPane tabId="kit">
              <DocxEditor
                editorState={impression}
                setEditorState={(newState) => {
                  setImpression(newState);
                  delayedSave("impression", newState, impTimeout);
                }}
                _className="mt-3 border"
                _style={{
                  minHeight: "200px",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
              />
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

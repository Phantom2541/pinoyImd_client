import {
  MDBCol,
  MDBNav,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTabPane,
  MDBTabContent,
  MDBNavLink,
  MDBNavItem,
} from "mdbreact";
import RawResult from "./rawResult";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
const Echo = () => {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const [description, setDescription] = useState("");
  const [impression, setImpression] = useState("");

  const [activeTab, setActiveTab] = useState("results");

  const descTimeout = useRef(null);
  const impTimeout = useRef(null);

  // Load values from task
  useEffect(() => {
    if (task?.description) {
      try {
        const parsed = JSON.parse(task.description);
        setDescription(parsed?.blocks?.map((b) => b.text).join("\n") || "");
      } catch (e) {
        setDescription(task.description);
      }
    }
    if (task?.impression) {
      try {
        const parsed = JSON.parse(task.impression);
        setImpression(parsed?.blocks?.map((b) => b.text).join("\n") || "");
      } catch (e) {
        setImpression(task.impression);
      }
    }
  }, [task?.description, task?.impression]);

  const delayedSave = useCallback(
    (field, value, timeoutRef) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const updatedTask = {
          ...task,
          [field]: value,
        };
        dispatch(SetTASK({ form: task?.form, task: updatedTask }));
      }, 500);
    },
    [dispatch, task]
  );

  return (
    <MDBRow>
      <MDBCol md="6">
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <RawResult />
        </div>
      </MDBCol>
      <MDBCol>
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
                <textarea
                  className="form-control mt-3 border"
                  style={{
                    minHeight: "285px",
                    overflowY: "auto",
                    maxHeight: "285px",
                  }}
                  value={description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDescription(val);
                    delayedSave("description", val, descTimeout);
                  }}
                />
              </MDBTabPane>

              <MDBTabPane tabId="kit">
                <textarea
                  className="form-control mt-3 border"
                  style={{
                    minHeight: "285px",
                    overflowY: "auto",
                    maxHeight: "285px",
                  }}
                  value={impression}
                  onChange={(e) => {
                    const val = e.target.value;
                    setImpression(val);
                    delayedSave("impression", val, impTimeout);
                  }}
                />
              </MDBTabPane>
            </MDBTabContent>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default Echo;

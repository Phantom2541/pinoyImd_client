import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import { SetTASK } from "./../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import { Services } from "../../../../../../../../../services/fakeDb/index.js";
import Images from "../images.jsx";

export default function Ecg() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const [findings, setFindings] = useState("");
  const [activeTab, setActiveTab] = useState("images");

  // Load values from task
  useEffect(() => {
    if (task?.findings) {
      try {
        const parsed = JSON.parse(task.findings);
        setFindings(parsed?.blocks?.map((b) => b.text).join("\n") || "");
      } catch (e) {
        setFindings(task.findings);
      }
    }
  }, [task]);

  useEffect(() => {
    dispatch(SetTASK({ form: task?.form, task: { ...task, findings } }));
  }, [findings]);

  return (
    <div className="mx-auto mt-n2">
      {Services.getName(task?.packages)}
      <MDBNav color="primary" tabs className="nav-justified">
        <MDBNavItem>
          <MDBNavLink
            link
            to="#!"
            active={activeTab === "results"}
            onClick={() => setActiveTab("results")}
          >
            Findings
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            to="#!"
            active={activeTab === "images"}
            onClick={() => setActiveTab("images")}
          >
            Images
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
                  minHeight: "200px",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
                value={findings}
                onChange={(e) => {
                  const val = e.target.value;
                  setFindings(val);
                  const updatedTask = {
                    ...task,
                    findings: val,
                  };
                  dispatch(SetTASK({ form: task?.form, task: updatedTask }));
                  // delayedSave("findings", val, descTimeout);
                }}
              />
            </MDBTabPane>
            <Images />
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

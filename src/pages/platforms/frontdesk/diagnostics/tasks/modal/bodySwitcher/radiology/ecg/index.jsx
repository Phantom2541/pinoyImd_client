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

export default function Ecg() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const [findings, setFindings] = useState("");
  const [activeTab, setActiveTab] = useState("results");

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
  }, [task?.findings]);

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
            Findings
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
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

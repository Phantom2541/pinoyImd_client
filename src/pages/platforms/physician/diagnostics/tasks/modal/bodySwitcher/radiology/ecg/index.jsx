import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBRow,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import { SetTASK } from "./../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import { Services } from "../../../../../../../../../services/fakeDb/index.js";
import ImgMagnifier from "../../../../../../../../../components/images/imageMagnifier/imgMagnifier.jsx";
import { gDrive } from "../../../../../../../../../services/utilities/index.js";

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
  }, [task]);

  return (
    <div className="mx-auto mt-n3">
      {Services.getName(task?.packages)}
      <MDBRow>
        <MDBCol>
          <div style={{ height: "25rem" }}>
            <ImgMagnifier src={gDrive.view(task?.fileId)} />
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
                      minHeight: "285px",
                      overflowY: "auto",
                      maxHeight: "285px",
                    }}
                    value={findings}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFindings(val);
                      const updatedTask = {
                        ...task,
                        findings: val,
                      };
                      dispatch(
                        SetTASK({ form: task?.form, task: updatedTask })
                      );
                    }}
                  />
                </MDBTabPane>
              </MDBTabContent>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
}

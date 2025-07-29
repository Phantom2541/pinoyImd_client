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
  const [link, setLink] = useState("");
  const [activeTab, setActiveTab] = useState("findings");

  // compute preview image URL if fileId exists
  const imageUrl = task?.fileId
    ? `https://drive.google.com/uc?export=view&id=${task.fileId}`
    : link;

  useEffect(() => {
    if (task?.findings) {
      try {
        const parsed = JSON.parse(task.findings);
        setFindings(parsed?.blocks?.map((b) => b.text).join("\n") || "");
      } catch (e) {
        setFindings(task.findings);
      }
    }

    if (task?.link) {
      setLink(task.link);
    }
  }, [task]);

  const handleFindingsChange = (val) => {
    setFindings(val);
    const updatedTask = {
      ...task,
      findings: val,
    };
    dispatch(SetTASK({ form: task?.form, task: updatedTask }));
  };

  const handleLinkChange = (val) => {
    setLink(val);
    const updatedTask = {
      ...task,
      link: val,
    };
    dispatch(SetTASK({ form: task?.form, task: updatedTask }));
  };

  return (
    <div className="mx-auto">
      <MDBNav color="primary" tabs className="nav-justified">
        <MDBNavItem>
          <MDBNavLink
            link
            active={activeTab === "findings"}
            to="#!"
            onClick={() => setActiveTab("findings")}
          >
            Findings
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            active={activeTab === "images"}
            to="#!"
            onClick={() => setActiveTab("images")}
          >
            Images
          </MDBNavLink>
        </MDBNavItem>
      </MDBNav>

      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="findings">
              <textarea
                className="form-control mt-3 border"
                style={{
                  minHeight: "200px",
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
                value={findings}
                onChange={(e) => handleFindingsChange(e.target.value)}
              />
            </MDBTabPane>

            <MDBTabPane tabId="images">
              <label htmlFor="link">Google Drive link</label>
              <input
                type="text"
                name="link"
                id="link"
                value={link}
                onChange={(e) => handleLinkChange(e.target.value)}
                className="w-100 text-center fw-bold"
              />
              {imageUrl && (
                <div className="text-center mt-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                  <p className="text-muted small mt-2">
                    Preview from{" "}
                    {task?.fileId ? "Google Drive fileId" : "Direct Link"}
                  </p>
                </div>
              )}
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}

import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTabPane,
  MDBModalBody,
  MDBTabContent,
} from "mdbreact";
import { useState } from "react";
import Configure from "./config";
import DryRun from "./dry-run";
const LIS = () => {
  const [activeTab, setActiveTab] = useState("config");
  return (
    <>
      <MDBBtnGroup>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("config")}
          outline={"config" !== activeTab}
        >
          <MDBIcon icon="tools" className="mr-1" /> Configure
        </MDBBtn>
        <MDBBtn
          className="m-0 rounded-top"
          color="primary z-depth-0"
          onClick={() => setActiveTab("dry-run")}
          outline={"dry-run" !== activeTab}
        >
          <MDBIcon icon="tram" className="mr-1" /> Dry Run
        </MDBBtn>
      </MDBBtnGroup>
      <MDBTabContent
        activeItem={activeTab}
        style={{
          border: "3px solid",
          borderRadius: "0 4px 0 0",
        }}
        className="p-0 border-primary z-depth-1 rounded-bottom rounded-top-end"
      >
        <MDBTabPane tabId="config">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            {activeTab === "config" && <Configure />}
          </MDBModalBody>
        </MDBTabPane>
        <MDBTabPane tabId="dry-run">
          <MDBModalBody className="pt-1 p-0 bg-primary">
            {activeTab === "dry-run" && <DryRun />}
          </MDBModalBody>
        </MDBTabPane>
      </MDBTabContent>
    </>
  );
};

export default LIS;

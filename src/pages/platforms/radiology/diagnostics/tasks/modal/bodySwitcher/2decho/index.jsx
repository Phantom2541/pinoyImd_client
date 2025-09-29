import { useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBTabContent,
  MDBTabPane,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBCard,
  MDBCardBody,
} from "mdbreact";

// Component imports
import MMode from "./mMode";
import Volumes from "./volumes";
import Paramets from "./paramets";
import Diastolic from "./diastolic";
// import Flow from "./flowDoppler";
// import Regurgitation from "./regurgitation";
// import TissueDopler from "./tissueDopler";
// import ExtraVal from "./extraVal";

export default function TwoDEcho() {
  // default to MMode
  const [activeTab, setActiveTab] = useState("MMode");

  // Define all possible tabs (always visible)
  const orderedTabs = [
    { name: "MMode", component: MMode },
    { name: "Volumes", component: Volumes },
    { name: "Parameters", component: Paramets },
    { name: "Diastolic", component: Diastolic },
    // { name: "Flow", component: Flow },
    // { name: "Regurgitation", component: Regurgitation },
    // { name: "Tissue Dopler", component: TissueDopler },
    // { name: "Extra Value", component: ExtraVal },
  ];

  return (
    <MDBContainer>
      {/* Navigation */}
      <MDBNav color="primary" tabs className="nav-justified">
        {orderedTabs.map((tab, index) => (
          <MDBNavItem key={`nav-${index}`}>
            <MDBNavLink
              link
              active={tab.name === activeTab}
              to="#!"
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.name}
            </MDBNavLink>
          </MDBNavItem>
        ))}
      </MDBNav>

      {/* Tab content */}
      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab}>
            {orderedTabs.map((tab, index) => (
              <MDBTabPane key={`pane-${index}`} tabId={tab.name}>
                <tab.component
                  setActiveTab={setActiveTab}
                  activeTab={activeTab}
                />
              </MDBTabPane>
            ))}
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

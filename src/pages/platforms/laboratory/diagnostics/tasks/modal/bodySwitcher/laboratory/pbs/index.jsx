import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import RBC from "./rbc";
import { useState } from "react";
import WBC from "./wbc";
import Platelets from "./platelets";
import Parasites from "./parasites";
import Impression from "./impression";

const Tabs = [
  { name: "RBC", component: RBC },
  { name: "WBC", component: WBC },
  { name: "Platelets", component: Platelets },
  { name: "Parasites", component: Parasites },
  { name: "Impression", component: Impression },
];
export default function Pbs() {
  const [activeTab, setActiveTab] = useState("RBC");
  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified">
        {Tabs.map((tab, index) => (
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
      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab}>
            {Tabs.map((tab, index) => (
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

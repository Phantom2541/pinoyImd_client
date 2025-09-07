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
import PhysicalExam from "./physicalExam";
import MicroExam from "./microExam";
// import Rci from "./rci";
// import Platelet from "./platelet";

export default function Seminogram() {
  const { task } = useSelector(({ validator }) => validator),
    [activeTab, setActiveTab] = useState("PHYSICAL EXAM");

  const { packages = [] } = task;

  // Define tab structure in the order you want them to appear
  const orderedTabs = [
    { name: "PHYSICAL EXAM", component: PhysicalExam, key: 3 },
    { name: "MICROSCOPIC EXAM", component: MicroExam, key: 3 },
    // { name: "MORPHOLOGY", component: Platelet, key: 3 },
    // { name: "CHEMICAL EXAM", component: Rci, key: 3 },
  ];

  // Filter only tabs relevant to current packages
  const availableTabs = orderedTabs.filter((tab) => packages.includes(tab.key));

  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified">
        {availableTabs.map((tab, index) => (
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
            {availableTabs.map((tab, index) => (
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

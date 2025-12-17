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
import Cellcount from "./cellcount";
import Diffcount from "./diffcount";
import Rci from "./rci";
import Platelet from "./platelet";
import ClottingFactor from "./clottingFactor";
import SpecialTest from "./speciaTest"; // Check spelling: should this be "specialTest"?

export default function Hematology() {
  const { task } = useSelector(({ validator }) => validator),
    [activeTab, setActiveTab] = useState("CELL COUNT");

  const { packages = [] } = task;

  // Define tab structure in the order you want them to appear
  const orderedTabs = [
    { name: "CELL COUNT", component: Cellcount, key: 58 },
    { name: "DIFF COUNT", component: Diffcount, key: 58 },
    { name: "PLATELET", component: Platelet, key: 59 },
    { name: "RCI", component: Rci, key: 58 },
    { name: "CLOTTING FACTOR", component: ClottingFactor, key: 61 },
    { name: "SPECIAL TEST", component: SpecialTest, key: 62 },
    { name: "SPECIAL TEST", component: SpecialTest, key: 63 },
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

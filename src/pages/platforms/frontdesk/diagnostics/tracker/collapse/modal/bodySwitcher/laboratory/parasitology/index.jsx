import React, { useState } from "react";
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
import Physical from "./physical";
import Chemical from "./chemical";
import Microscopic from "./microscopic";

const tabs = ["PHYSICAL", "CHEMICAL", "MICROSCOPIC"],
  components = [Physical, Chemical, Microscopic];

export default function Parasitology({ task, setTask }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified">
        {tabs.map((tab, index) => (
          <MDBNavItem key={`tab-${index}`}>
            <MDBNavLink
              link
              active={index === activeTab}
              to="#!"
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </MDBNavLink>
          </MDBNavItem>
        ))}
      </MDBNav>
      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab}>
            {components.map((Component, index) => {
              return (
                <MDBTabPane key={`component-${index}`} tabId={index}>
                  <Component task={task} setTask={setTask} />
                </MDBTabPane>
              );
            })}
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

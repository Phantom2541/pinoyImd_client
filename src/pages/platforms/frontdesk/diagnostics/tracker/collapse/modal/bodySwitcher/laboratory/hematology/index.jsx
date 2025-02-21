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
import Cellcount from "./cellcount";
import Diffcount from "./diffcount";
import Rci from "./rci";
import Platelet from "./platelet";
import ClottingFactor from "./clottingFactor";
import SpecialTest from "./speciaTest";

const tabs = {
  58: {
    names: ["CELL COUNT", "DIFF COUNT", "RCI"],
    components: [Cellcount, Diffcount, Rci],
  },
  59: {
    names: ["PLATELET"],
    components: [Platelet],
  },
  60: {
    names: ["CLOTTING FACTOR"],
    components: [ClottingFactor],
  },
  62: {
    names: ["SPECIAL TEST"],
    components: [SpecialTest],
  },
};

export default function Hematology({ task, setTask }) {
  const [activeTab, setActiveTab] = useState("CELL COUNT");

  const { packages = [] } = task;

  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified">
        {Object.entries(tabs).map(([key, { names }]) => {
          if (!packages.includes(Number(key))) return null;

          return names.map((name, index) => (
            <MDBNavItem key={`tab-${index}`}>
              <MDBNavLink
                link
                active={name === activeTab}
                to="#!"
                onClick={() => setActiveTab(name)}
              >
                {name}
              </MDBNavLink>
            </MDBNavItem>
          ));
        })}
      </MDBNav>
      <MDBCard>
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab}>
            {Object.entries(tabs).map(([key, { components, names }]) => {
              if (!packages.includes(Number(key))) return null;

              return components.map((Component, index) => (
                <MDBTabPane key={`component-${index}`} tabId={names[index]}>
                  <Component task={task} setTask={setTask} />
                </MDBTabPane>
              ));
            })}
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

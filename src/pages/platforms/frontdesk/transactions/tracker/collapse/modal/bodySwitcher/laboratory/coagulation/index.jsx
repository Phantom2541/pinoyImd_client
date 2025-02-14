import React, { useState } from "react";
import {
  // MDBTabsContent,
  MDBTabContent,
  MDBTabPane,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBCardBody,
  MDBCol,
  MDBRow,
  // MDBTabs,
  // MDBTabsPane,
  MDBCardHeader,
  MDBCard,
} from "mdbreact";
import { Protime, APTT } from "./containers";

const Coagulation = ({ task, setTask }) => {
  const // [pt, setPt] = useState([null, null]),
    // [aptt, setAptt] = useState([null, null]),
    [activeTab, setActiveTab] = useState("tab1");
  console.log("task", task);

  return (
    <MDBCard>
      <MDBCardHeader>
        <MDBNav color="primary" tabs className="nav-justified">
          <MDBNavItem>
            <MDBNavLink
              link
              active={activeTab === "tab1"}
              to="#!"
              onClick={() => setActiveTab("tab1")}
            >
              PT
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink
              link
              active={activeTab === "tab2"}
              to="#!"
              onClick={() => setActiveTab("tab2")}
            >
              aPTT
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
      </MDBCardHeader>
      <MDBCardBody>
        <MDBRow>
          <MDBCol>
            <MDBTabContent activeItem={activeTab}>
              <MDBTabPane tabId={"tab1"}>
                <h2 className="text-center">Protime</h2>
                <Protime task={task} setTask={setTask} />
                {/* <Component task={task} setTask={setTask} /> */}
              </MDBTabPane>
              <MDBTabPane tabId={"tab2"}>
                <h2 className="text-center">APTT</h2>
                <APTT task={task} setTask={setTask} />
                {/* <Component task={task} setTask={setTask} /> */}
              </MDBTabPane>
            </MDBTabContent>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Coagulation;

import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBContainer,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
  MDBRow,
  MDBCol,
} from "mdbreact";
import CustomSelect from "../../../../../../../../../../components/searchables/customSelect";
import Troupe from "./troupe";
import Picture from "./picture";

const choices = [
  {
    str: "Negative",
    index: 0,
  },
  {
    str: "Positive",
    index: 1,
  },
];

export default function Drugtest({ task, setTask }) {
  const [activeTab, setActiveTab] = useState("pic");
  // const { met, thc, method, company, purpose } = task;
  const { met, thc } = task;

  const handleSelectChange = (name, value) =>
    setTask({ ...task, [name]: value });

  return (
    <MDBContainer>
      {/* Default is 1, hide all the tab button */}
      <MDBNav color="primary" tabs className="nav-justified">
        <MDBNavItem>
          <MDBNavLink
            link
            active={"pic" === activeTab}
            to="#!"
            onClick={() => setActiveTab("pic")}
          >
            Picture
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            active={"details" === activeTab}
            to="#!"
            onClick={() => setActiveTab("details")}
          >
            DETAILS
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            active={activeTab === "results"}
            to="#!"
            onClick={() => setActiveTab("results")}
          >
            RESULTS
          </MDBNavLink>
        </MDBNavItem>
      </MDBNav>
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle className="text-left mt-3">Description</MDBCardTitle>
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="results">
              <MDBRow className="text-left">
                <MDBCol>
                  <CustomSelect
                    inputClassName={met && "text-danger"}
                    choices={choices}
                    label="Methamphetamine"
                    preValue={String(met)}
                    texts="str"
                    values="index"
                    onChange={(e) => handleSelectChange("met", Number(e))}
                  />
                </MDBCol>
                <MDBCol>
                  <CustomSelect
                    inputClassName={thc && "text-danger"}
                    choices={choices}
                    label="Tetrahydrocannabinol"
                    preValue={String(thc)}
                    texts="str"
                    values="index"
                    onChange={(e) => handleSelectChange("igm", Number(e))}
                  />
                </MDBCol>
              </MDBRow>
            </MDBTabPane>
            <MDBTabPane tabId="details">
              <Troupe
                task={task}
                setTask={setTask}
                handleSelectChange={handleSelectChange}
              />
            </MDBTabPane>
            <MDBTabPane tabId="pic">
              <Picture
                task={task}
                setTask={setTask}
                handleSelectChange={handleSelectChange}
              />
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

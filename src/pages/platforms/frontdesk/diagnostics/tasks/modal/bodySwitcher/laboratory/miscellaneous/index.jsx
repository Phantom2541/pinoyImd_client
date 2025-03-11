import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBContainer,
  MDBInput,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import BodySwitcher from "./bodySwitcher";
import Troupe from "./troupe";
import Category from "./category";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function Miscellaneous() {
  const { task } = useSelector(({ validator }) => validator),
    [activeTab, setActiveTab] = useState("results"),
    dispatch = useDispatch();

  const { packages = [], specimen = "" } = task;

  const setTask = (value) => dispatch(SetTASK(value));
  return (
    <MDBContainer>
      {/* Default is 1, hide all the tab button
        146=ogtt,
        11=hba1c
      */}

      {!packages.includes(146, 11) && (
        <MDBNav color="primary" tabs className="nav-justified">
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
          <MDBNavItem>
            <MDBNavLink
              link
              active={"kit" === activeTab}
              to="#!"
              onClick={() => setActiveTab("kit")}
            >
              KIT DETAILS
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>
      )}

      <MDBCard>
        <MDBCardBody>
          {!packages.includes(146, 11) && (
            <MDBCardTitle className="text-left mt-3">Description</MDBCardTitle>
          )}
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="results">
              {!packages.includes(146, 11) && (
                <MDBInput
                  className="mt-0"
                  label="Specimen"
                  value={specimen}
                  onChange={(e) =>
                    setTask({ ...task, specimen: e.target.value })
                  }
                />
              )}
              <BodySwitcher task={task} setTask={setTask} />
            </MDBTabPane>
            <MDBTabPane tabId="kit">
              {packages.includes(146, 11) && (
                <Category task={task} setTask={setTask} />
              )}
              {!packages.includes(146, 11) && (
                <Troupe task={task} setTask={setTask} />
              )}
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

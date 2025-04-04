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

  const setTask = (value) =>
    dispatch(SetTASK({ form: task?.form, task: value }));
    console.log("packages", packages);
    
  // ✅ Corrected way to check if packages include 146 or 11
  const hasSpecialPackage = packages.some((pkg) => [146, 11].includes(pkg));
  console.log("hasSpecialPackage", hasSpecialPackage);
  
  return (
    <MDBContainer>
      {/* If no special package, show the tab buttons */}
      {!hasSpecialPackage && (
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
          {!hasSpecialPackage && (
            <MDBCardTitle className="text-left mt-3">Description</MDBCardTitle>
          )}
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="results">
              {!hasSpecialPackage && (
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
              {hasSpecialPackage ? (
                <Category task={task} setTask={setTask} />
              ) : (
                <Troupe task={task} setTask={setTask} />
              )}
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

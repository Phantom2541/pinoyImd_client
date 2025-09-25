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

  // ✅ Corrected way to check if packages include 146 or 11
  const hasSpecialPackage = packages.some((pkg) => [146, 11].includes(pkg));
  const hasKit = !packages.includes(121) && !packages.includes(66); //blood typing =66 , Widal =121
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
          {hasKit && (
            <MDBNavItem>
              <MDBNavLink
                link
                active={activeTab === "kit"}
                to="#!"
                onClick={() => setActiveTab("kit")}
              >
                KIT
              </MDBNavLink>
            </MDBNavItem>
          )}
        </MDBNav>
      )}

      <MDBCard>
        <MDBCardBody>
          {!hasSpecialPackage && hasKit && (
            <MDBCardTitle className="text-left mt-3">Description</MDBCardTitle>
          )}
          <MDBTabContent activeItem={activeTab} className="pt-0">
            <MDBTabPane tabId="results">
              {!packages.includes(146) && hasKit && (
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
              <div className={!hasKit ? "mt-5" : ""}>
                {hasSpecialPackage ? (
                  <Category task={task} setTask={setTask} />
                ) : (
                  <Troupe task={task} setTask={setTask} />
                )}
              </div>
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

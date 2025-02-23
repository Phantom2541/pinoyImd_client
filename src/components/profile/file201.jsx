import React, { useState, useEffect } from "react";
import {
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import Resume from "./resume";
import PRC from "./prc";
import Board from "./board";
import Diploma from "./diploma";
import Medical from "./medical";
import { useDispatch, useSelector } from "react-redux";
import {
  USER,
  RESET,
} from "../../services/redux/slices/assets/persons/personnels";

const tabs = ["Resume", "PRC Id", "Board Cert", "Diploma", "Medical Cert"],
  components = [Resume, PRC, Board, Diploma, Medical];

export default function Details() {
  const [activeTab, setActiveTab] = useState(0),
    { auth, token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(
        USER({ token, branchId: activePlatform?.branchId, userId: auth._id })
      );

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  return (
    <MDBContainer>
      <MDBNav color="secondary" tabs className="nav-justified">
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
      <MDBTabContent activeItem={activeTab}>
        {components.map((Component, index) => {
          return (
            <MDBTabPane key={`component-${index}`} tabId={index}>
              <Component
              // address={address}
              // setAddress={setAddress}
              // form={form}
              // handleChange={handleChange}
              // handleSubmit={handleSubmit}
              // isLoading={isLoading}
              />
            </MDBTabPane>
          );
        })}
      </MDBTabContent>
    </MDBContainer>
  );
}

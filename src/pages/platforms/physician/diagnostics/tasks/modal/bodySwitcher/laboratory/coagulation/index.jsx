import React, { useState, useEffect } from "react";
import {
  MDBTabContent,
  MDBTabPane,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
} from "mdbreact";
import { useSelector } from "react-redux";
import { Protime, APTT } from "./containers";

const Coagulation = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { packages } = useSelector(({ task }) => task),
    [pt, setPt] = useState([null, null]),
    [aptt, setAptt] = useState([null, null]),
    [verticalActive, setVerticalActive] = useState("tab1");

  useEffect(() => {
    if (packages.includes(53)) setVerticalActive("tab1");
    else if (packages.includes(54)) setVerticalActive("tab2");
  }, [packages]);

  const handleVerticalClick = (value) =>
    value !== verticalActive && setVerticalActive(value);

  return (
    <MDBCardBody>
      <MDBRow>
        {packages.length > 1 && (
          <MDBCol size="3">
            <MDBNav pills vertical className="text-center">
              {packages.includes(53) && (
                <MDBNavItem>
                  <MDBNavLink
                    to="#!"
                    active={verticalActive === "tab1"}
                    onClick={() => handleVerticalClick("tab1")}
                  >
                    Protime
                  </MDBNavLink>
                </MDBNavItem>
              )}
              {packages.includes(54) && (
                <MDBNavItem>
                  <MDBNavLink
                    to="#!"
                    active={verticalActive === "tab2"}
                    onClick={() => handleVerticalClick("tab2")}
                  >
                    APTT
                  </MDBNavLink>
                </MDBNavItem>
              )}
            </MDBNav>
          </MDBCol>
        )}
        <MDBCol size={packages.length > 1 ? 9 : 12}>
          <MDBTabContent>
            <MDBTabPane show={verticalActive === "tab1"}>
              <h2 className="text-center">Protime</h2>
              <Protime pt={pt} setPt={setPt} />
            </MDBTabPane>
            <MDBTabPane show={verticalActive === "tab2"}>
              <h2 className="text-center">APTT</h2>
              <APTT aptt={aptt} setAptt={setAptt} />
            </MDBTabPane>
          </MDBTabContent>
        </MDBCol>
      </MDBRow>
    </MDBCardBody>
  );
};

export default Coagulation;

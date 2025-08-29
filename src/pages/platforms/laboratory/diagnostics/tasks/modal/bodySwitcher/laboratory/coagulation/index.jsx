import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  MDBCardBody,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBCard,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import { Protime, APTT } from "./containers";

const Coagulation = () => {
  const { task } = useSelector(({ validator }) => validator);
  const [pt, setPt] = useState([null, null]);
  const [aptt, setAptt] = useState([null, null]);
  const [activeTab, setActiveTab] = useState("tab1");
  const { packages = [] } = task;
  useEffect(() => {
    packages.includes(53) && setActiveTab("tab1");
    packages.includes(54) && setActiveTab("tab2");
  }, [packages]);

  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified py-2">
        {packages.includes(53) && (
          <MDBNavItem>
            <MDBNavLink
              link
              active={"tab1" === activeTab}
              to="#!"
              onClick={() => setActiveTab("tab1")}
            >
              Protime
            </MDBNavLink>
          </MDBNavItem>
        )}
        {packages.includes(54) && (
          <MDBNavItem>
            <MDBNavLink
              link
              active={"tab2" === activeTab}
              to="#!"
              onClick={() => setActiveTab("tab2")}
            >
              APTT
            </MDBNavLink>
          </MDBNavItem>
        )}
      </MDBNav>
      <MDBCard className="mb-2">
        <MDBCardBody>
          <MDBTabContent activeItem={activeTab}>
            {activeTab === "tab1" && (
              <MDBTabPane tabId={"tab1"}>
                <Protime pt={pt} setPt={setPt} aptt={aptt} setAptt={setAptt} />
              </MDBTabPane>
            )}

            {activeTab === "tab2" && (
              <MDBTabPane tabId={"tab2"}>
                <APTT pt={pt} setPt={setPt} aptt={aptt} setAptt={setAptt} />
              </MDBTabPane>
            )}
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Coagulation;

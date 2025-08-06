import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBTabContent,
  MDBTabPane,
} from "mdbreact";
import Troupe from "./troupe";
import Picture from "./picture";
import Results from "./results";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import FingerPrint from "./print";

export default function Drugtest() {
  const { task } = useSelector(({ validator }) => validator),
    [activeTab, setActiveTab] = useState("img"),
    dispatch = useDispatch();

  const handleSelectChange = (name, value) =>
    dispatch(SetTASK({ form: task?.form, task: { ...task, [name]: value } }));

  return (
    <MDBContainer>
      <MDBNav color="primary" tabs className="nav-justified">
        <MDBNavItem>
          <MDBNavLink
            link
            active={"img" === activeTab}
            to="#!"
            onClick={() => setActiveTab("img")}
          >
            Picture
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
          <MDBNavLink
            link
            active={"fingerPrint" === activeTab}
            to="#!"
            onClick={() => setActiveTab("fingerPrint")}
          >
            Finger Print
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
          <MDBTabContent activeItem={activeTab} className="">
            <MDBTabPane tabId="results">
              <Results />
            </MDBTabPane>
            <MDBTabPane tabId="details">
              <Troupe
                task={task}
                // setTask={setTask}
                handleSelectChange={handleSelectChange}
              />
            </MDBTabPane>
            <MDBTabPane tabId="img">
              <Picture
                task={task}
                // setTask={setTask}
                handleSelectChange={handleSelectChange}
              />
            </MDBTabPane>
            <MDBTabPane tabId="fingerPrint">
              <FingerPrint
                task={task}
                // setTask={setTask}
                handleSelectChange={handleSelectChange}
              />
            </MDBTabPane>
          </MDBTabContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

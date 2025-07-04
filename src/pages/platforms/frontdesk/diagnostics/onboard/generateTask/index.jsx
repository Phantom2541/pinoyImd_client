import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  REFORM,
  TOGGLE,
} from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { axioKit, fullName } from "../../../../../../services/utilities";
import CaseBox from "./case";
import { Services } from "../../../../../../services/fakeDb";
import MachineSender from "./machines";

/**
 * Common for Buntis and Blood Donors
 * HIV:68, RPR:69, HBsAg:70,  HCV:97
 */
const panel = [68, 69, 70, 97];
export default function Modal() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    {
      show,
      selected: deal,
      inhouse,
      outsource,
    } = useSelector(({ taskGenerator }) => taskGenerator),
    // { collections } = useSelector(({ providers }) => providers),
    [outSourceId, setOutSourceId] = useState(""),
    dispatch = useDispatch();

  const toggle = () => {
    dispatch(TOGGLE());
  };

  useEffect(() => {
    if (show) setOutSourceId("");
  }, [show]);
  const department = activePlatform.department === "Laboratory" ? "LAB" : "RAD";

  const getIDS = (collections) => collections.map(({ id }) => id);
  const saveRequest = async (template, data, isStaticPath = false) => {
    try {
      const _department = ["Laboratory", "Radiology"].includes(
        activePlatform.department
      )
        ? activePlatform.department
        : "clinic"; // default fallback just in case
      const url = isStaticPath
        ? template
        : `/diagnostics/${_department.toLowerCase()}/result/${template}`;
      await axioKit.save(url, data, token);
    } catch (error) {
      console.error("Error saving request:", error);
    }
  };
  const generateTask = async () => {
    const inhouseIDS = getIDS(inhouse);
    const _outsource = getIDS(outsource);
    const _inhouse = Services.getTemplatesWithIntKey(inhouseIDS, department);
    const _forms = Services.getTemplates(inhouseIDS, department);
    MachineSender(_forms, deal);
  };

  return (
    <MDBModal isOpen={show} backdrop toggle={toggle} size="lg">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon className="mr-2" icon="tasks" />
        {fullName(deal?.customerId?.fullName)} <br />
        <h6
          style={{
            fontWeight: 400,
            marginTop: "-0px",
            marginBottom: "-0.5rem",
            marginLeft: "2.1rem",
          }}
        >
          Task Generator
        </h6>
      </MDBModalHeader>
      <form>
        <MDBModalBody className="mb-0">
          <MDBTypography noteTitle="Description: " note noteColor="warning">
            Drag and drop tasks between 'Inhouse' and 'Outsource' for easy
            management.
          </MDBTypography>

          <CaseBox outSource={outSourceId} setOutSource={setOutSourceId} />
          <MDBBtn
            className="float-right mt-3 mb-3"
            color="primary"
            onClick={generateTask}
          >
            Generate
          </MDBBtn>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}

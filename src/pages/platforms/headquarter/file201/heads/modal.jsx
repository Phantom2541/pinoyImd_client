import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  EMPLOYEES,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { capitalize, isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";
import { Select } from "../../../../../components/customizable";
// import Templates from "../../../../../components/searchables/templates";
import TemplatetUtils from "../../../../../services/fakeDb/diagnostics/templates";
// declare your expected items
const _form = {
  user: "",
  department: "",
  section: "",
};

// var department = [
//   { text: "Radiology", value: "radiology" },
//   { text: "Laboratory", value: "laboratory" },
// ];
// var sections = [
//   { text: "Pathologist", value: "pathologist" },
//   { text: "Radiologist", value: "radiologist" },
//   { text: "Analysis", value: "analysis" },
//   { text: "Bacteriology", value: "bacteriology" },
//   { text: "Biopsy", value: "biopsy" },
//   { text: "Chemistry", value: "chemistry" },
//   { text: "Coagulation", value: "coagulation" },
//   { text: "Compatibility", value: "compatibility" },
//   { text: "Drugtest", value: "drugtest" },
//   { text: "Hematology", value: "hematology" },
//   { text: "Miscellaneous", value: "Parasitology" },
//   { text: "PAPs", value: "paps" },
//   { text: "PBS", value: "pbs" },
//   { text: "Serology", value: "serology" },
//   { text: "Uniralysis", value: "uniralysis" },
//   { text: "ECG", value: "ecg" },
//   { text: "Ultrasound", value: "ultrasound" },
//   { text: "Xray", value: "xray" },
//   { text: "2DEcho", value: "2decho" },
// ];
export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, collections } = useSelector(
      ({ personnels }) => personnels
    ),
    [crews, setCrews] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [sections, setSections] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { department } = activePlatform;

  useEffect(() => {
    if (willCreate && activePlatform?.branchId)
      dispatch(EMPLOYEES({ token, branch: activePlatform?.branchId }));
    return () => dispatch(RESET());
  }, [activePlatform, token, willCreate, dispatch]);

  useEffect(() => {
    const _sections = TemplatetUtils.getComponents(
      department === "laboratory" ? "LAB" : "RAD"
    );
    _sections.push(department === "laboratory" ? "Pathologist" : "Radiologist");
    setSections(_sections);
  }, [department]);

  useEffect(() => {
    setCrews(collections);
  }, [collections]);

  useEffect(() => {
    if (show && !willCreate && selected._id) return setForm(selected);
  }, [show, willCreate, selected]);

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, id: selected._id, department },
        token,
      })
    );

    setForm(_form);
  };
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, branch: activePlatform?.branchId, department },
        token,
      })
    );

    setForm(_form);
    toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  // use for direct values like strings and numbers

  const handleSectionChange = (section) => {
    setForm({
      ...form,
      section,
    });
  };

  const handleStaffChange = (user) => {
    setForm({
      ...form,
      user,
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || " a Tag Staff"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <Select
                collections={
                  department === "laboratory" ? ["Laboratory"] : ["Radiology"]
                }
                preValue={capitalize(activePlatform.department)}
                label={"Department"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={"12"} className="mb-3">
              <Select
                collections={sections}
                onChange={handleSectionChange}
                preValue={selected.section && selected.section}
                label={"Sections"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="12">
              <Select
                collections={crews.map((crew) => ({
                  _id: crew?.user?._id,
                  fullName: fullName(crew?.user?.fullName),
                }))}
                onChange={handleStaffChange}
                preValue={selected?._id && selected.user._id}
                label={"Staff"}
                keys={"_id"}
                values={"fullName"}
              />
            </MDBCol>
          </MDBRow>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

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
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";
import CustomSelect from "../../../../../components/customSelect";
// declare your expected items
const _form = {
  user: "",
  department: "",
  section: "",
};

var department = [
  { text: "Radiology", value: "radiology" },
  { text: "Laboratory", value: "laboratory" },
];
var sections = [
  { text: "Pathologist", value: "pathologist" },
  { text: "Analysis", value: "analysis" },
  { text: "Bacteriology", value: "bacteriology" },
  { text: "Biopsy", value: "biopsy" },
  { text: "Chemistry", value: "chemistry" },
  { text: "Coagulation", value: "coagulation" },
  { text: "Compatibility", value: "compatibility" },
  { text: "Drugtest", value: "drugtest" },
  { text: "Hematology", value: "hematology" },
  { text: "Miscellaneous", value: "Parasitology" },
  { text: "PAPs", value: "paps" },
  { text: "PBS", value: "pbs" },
  { text: "Serology", value: "serology" },
  { text: "Uniralysis", value: "uniralysis" },
  { text: "ECG", value: "ecg" },
  { text: "Ultrasound", value: "ultrasound" },
  { text: "Xray", value: "xray" },
  { text: "2DEcho", value: "2decho" },
];
export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading, collections } = useSelector(
      ({ personnels }) => personnels
    ),
    [crews, setCrews] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (willCreate && activePlatform?.branchId)
      dispatch(EMPLOYEES({ token, branch: activePlatform?.branchId }));
    return () => dispatch(RESET());
  }, [activePlatform, token, willCreate, dispatch]);

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
        data: { ...form, id: selected._id },
        token,
      })
    );

    setForm(_form);
  };
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, branch: activePlatform?.branchId },
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

  const handleSectionChange = (value) => {
    setForm({
      ...form,
      section: value,
    });
  };
  const handleDepartmentChange = (value) => {
    setForm({
      ...form,
      department: value,
    });
  };
  const handleStaffChange = (value) => {
    setForm({
      ...form,
      user: value,
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
              <CustomSelect
                choices={department}
                onChange={handleDepartmentChange}
                preValue={selected.department ? selected.department : ""}
                label={"Department"}
                values={"value"}
                texts={"text"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md={"12"} className="mb-3">
              <CustomSelect
                choices={sections}
                onChange={handleSectionChange}
                preValue={selected.section && selected.section}
                label={"Sections"}
                values={"value"}
                texts={"text"}
                multiple={false}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="12">
              <CustomSelect
                choices={crews.map((crew) => ({
                  _id: crew?.user?._id,
                  fullName: fullName(crew?.user?.fullName),
                }))}
                onChange={handleStaffChange}
                preValue={selected?._id && selected.user._id}
                label={"Staff"}
                values={"_id"}
                texts={"fullName"}
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

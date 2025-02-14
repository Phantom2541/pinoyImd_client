import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBSelect,
  MDBSelectOptions,
  MDBSelectInput,
  MDBSelectOption,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/responsibilities/access";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import CustomSelect from "../../../../../components/customSelect";
import { fullName } from "../../../../../services/utilities";
// declare your expected items
const _form = {
  user: "",
  designation: "",
};

// var designation = [
//   {
//     name: "Administrator",
//     value: "administrator",
//   },
//   {
//     name: "Manager",
//     value: "manager",
//   },
//   {
//     name: "Pathologist",
//     value: "pathologist",
//   },
//   {
//     name: "Med Tech",
//     value: "medtech",
//   },
//   {
//     name: "Tech",
//     value: "tech",
//   },
//   {
//     name: "Receptionist",
//     value: "receptionist",
//   },
// ];

export default function Modal({ show, toggle, selected, willCreate, users }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, onDuty, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  console.log("selected", selected);

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, branchId: onDuty._id, approvedBy: auth._id },
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

  const handleSelectChange = (key, value) => setForm({ ...form, [key]: value });

  const handleStaffChange = (value) =>
    setForm({
      ...form,
      userId: value,
    });
  const handleAccess = (value) =>
    setForm({
      ...form,
      platform: [...form.platform, value],
    });

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Staff"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <CustomSelect
                choices={users.map((crew) => ({
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
          <MDBRow>
            <MDBCol md="12">
              <MDBSelect
                className="colorful-select dropdown-primary hidden-md-down"
                getValue={(e) => handleSelectChange("employment", e[0])}
              >
                <MDBSelectInput selected={"Position"}></MDBSelectInput>
                <MDBSelectOptions className="form-select" name="section">
                  <MDBSelectOption value="admin">Administrator</MDBSelectOption>
                  <MDBSelectOption value="accreditation">
                    Accreditation
                  </MDBSelectOption>
                  <MDBSelectOption value="auditor">Auditor</MDBSelectOption>
                  <MDBSelectOption value="author">Author</MDBSelectOption>
                  <MDBSelectOption value="carpentry">Carpentry</MDBSelectOption>
                  <MDBSelectOption value="cashier">Cashier</MDBSelectOption>
                  <MDBSelectOption value="clinical">Clinical</MDBSelectOption>
                  <MDBSelectOption value="frontdesk">Frontdesk</MDBSelectOption>
                  <MDBSelectOption value="headquarter">
                    Headquarter
                  </MDBSelectOption>
                  <MDBSelectOption value="hr">HR</MDBSelectOption>
                  <MDBSelectOption value="laboratory">
                    Laboratory
                  </MDBSelectOption>
                  <MDBSelectOption value="manager">Manager</MDBSelectOption>
                  <MDBSelectOption value="nutritionist">
                    Nutritionist
                  </MDBSelectOption>
                  <MDBSelectOption value="pharmacist">
                    Pharmacist
                  </MDBSelectOption>
                  <MDBSelectOption value="procurement">
                    Procurement
                  </MDBSelectOption>
                  <MDBSelectOption value="radiology">Radiology</MDBSelectOption>
                  <MDBSelectOption value="utility">Utility</MDBSelectOption>
                </MDBSelectOptions>
              </MDBSelect>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBSelect
                className="colorful-select dropdown-primary hidden-md-down"
                getValue={(e) => handleAccess("platform", e[0])}
              >
                <MDBSelectInput selected={"Access (Platform)"}></MDBSelectInput>
                <MDBSelectOptions className="form-select" name="section">
                  <MDBSelectOption value="admin">Administrator</MDBSelectOption>
                </MDBSelectOptions>
              </MDBSelect>
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

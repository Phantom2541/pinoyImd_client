import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
  TOGGLETeam,
} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
import { SearchUser } from "../../../../../../components/searchables";
import { COMPANY } from "../../../../../../services/redux/slices/assets/persons/personnels";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { properFullname } from "../../../../../../services/utilities";
import { quest } from "../../../../../../services/redux/slices/diagnostics";

export default function Modal() {
  const { showModalTeam, toggle, selected, team, willCreateTeam, willAdd, isLoading } = useSelector(
      ({ quest }) => quest
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();
console.log(activePlatform);

    useEffect(() => {
    if (token){
    dispatch(
    COMPANY({ token, params: { companyId: activePlatform?.branch?.companyId?._id} })
    )
      }}, [dispatch, token]);
    
  // Handle update function
  const handleUpdate = () => {
    TOGGLETeam();

    // Check if object has chan ged
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );
  };

  // Handle create function
  const handleAdd = () => {
    let newTeam = [...team, form];
    dispatch(
      UPDATE({
      data:{_id: selected._id,team: newTeam},
    token,
      })
    ).then(() => TOGGLETeam()); // Close modal after successful save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreateTeam) {
      return handleAdd();
    }

    handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]:value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLETeam());
  const handleMember = (patient) => {
    
    console.log("patient", patient);
    setForm({
      ...form,
      userId: patient._id,
      user: patient
    });
    
  }
console.log("form", form);

  return (
    <MDBModal isOpen={showModalTeam} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willAdd ? "Remove" : "Add"} Member
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          ></MDBTypography>
          <MDBRow className="mb-3">
  <MDBCol>
    <MDBInput
      gap
      onClick={() => handleChange("type", "inhouse")}
      checked={form.type === "inhouse"}
      label="Inhouse"
      type="radio"
      id="inhouse"
    />
    <MDBInput
      gap
      onClick={() => handleChange("type", "collaboration")}
      checked={form.type === "collaboration"}
      label="Collaboration"
      type="radio"
      id="collaboration"
    />
    <MDBInput
      gap
      onClick={() => handleChange("type", "import")}
      checked={form.type === "import"}
      label="Import"
      type="radio"
      id="import"
    />
  </MDBCol>
</MDBRow>

          {/* <SearchUser 
            setPatient={handleMember}
          /> */}
        <label title={properFullname(form?.user?.fullName)}>Alias: {form?.user?.alias}</label>

          <MDBInput
            label="Role"
            type="text"
            value={handleValue("role")}
            required
            onChange={(e) => handleChange("role", e.target.value)}
          />
          <MDBInput
            label="PhoneNumber"
            type="text"
            value={handleValue("phoneNumber")}
            required
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <label>Inform</label>
          <select
          className="form-control form-control"
          value={handleValue("hasInformed")||""}
          onChange={(e) => handleChange("hasInformed", e.target.value)}
          >
          <option disable value="">Options
          </option>
          <option value="true">Informed</option>
          <option value="false">Not Inform</option>
          </select>
          {/* Submit button */}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="update"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willAdd ? "Upadate" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

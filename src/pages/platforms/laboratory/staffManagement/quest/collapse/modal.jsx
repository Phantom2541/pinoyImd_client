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
  UPDATE,
  TOGGLETeam,
} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
// import { SearchUser } from "../../../../../../components/searchables";
import { COMPANY } from "../../../../../../services/redux/slices/assets/persons/personnels";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { properFullname } from "../../../../../../services/utilities";

export default function Modal() {
  const { showModalTeam, selected, team, willCreateTeam, isLoading } =
      useSelector(({ quest }) => quest),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Load company data
  useEffect(() => {
    if (token) {
      dispatch(
        COMPANY({
          token,
          params: { companyId: activePlatform?.branch?.companyId?._id },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  // Handle update function
  const handleUpdate = () => {
    TOGGLETeam();

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

  // Handle add function
  const handleAdd = () => {
    const newTeam = [...team, form];
    dispatch(
      UPDATE({
        data: { _id: selected._id, team: newTeam },
        token,
      })
    ).then(() => TOGGLETeam());
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreateTeam) {
      return handleAdd();
    }

    handleUpdate();
  };

  // Handle change of inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Return correct form value
  const handleValue = (key) => form?.[key] ?? "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLETeam());

  // Handle selected member from search
  // const handleMember = (patient) => {
  //   setForm({
  //     ...form,
  //     userId: patient._id,
  //     user: patient,
  //   });
  // };

  return (
    <MDBModal isOpen={showModalTeam} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreateTeam ? "Add" : "Update"} Member
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          />

          <MDBRow className="mb-3">
            <MDBCol>
              <MDBInput
                gap
                onClick={() => handleChange("type", "inhouse")}
                checked={form?.type === "inhouse"}
                label="Inhouse"
                type="radio"
                id="inhouse"
              />
              <MDBInput
                gap
                onClick={() => handleChange("type", "collaboration")}
                checked={form?.type === "collaboration"}
                label="Collaboration"
                type="radio"
                id="collaboration"
              />
              <MDBInput
                gap
                onClick={() => handleChange("type", "import")}
                checked={form?.type === "import"}
                label="Import"
                type="radio"
                id="import"
              />
            </MDBCol>
          </MDBRow>

          {/* Uncomment if you want to search users */}
          {/* <SearchUser setPatient={handleMember} /> */}

          {form?.user && (
            <label title={properFullname(form.user.fullName)}>
              Alias: {form.user.alias}
            </label>
          )}

          <MDBInput
            label="Role"
            type="text"
            value={handleValue("role")}
            required
            onChange={(e) => handleChange("role", e.target.value)}
          />
          <MDBInput
            label="Phone Number"
            type="text"
            value={handleValue("phoneNumber")}
            required
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />

          <label>Inform</label>
          <select
            className="form-control"
            value={
              handleValue("hasInformed") === true
                ? "true"
                : handleValue("hasInformed") === false
                ? "false"
                : ""
            }
            onChange={(e) =>
              handleChange("hasInformed", e.target.value === "true")
            }
          >
            <option disabled value="">
              Options
            </option>
            <option value="true">Informed</option>
            <option value="false">Not Informed</option>
          </select>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreateTeam ? "Add" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

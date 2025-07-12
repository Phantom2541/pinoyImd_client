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
import { COMPANY } from "../../../../../../services/redux/slices/assets/persons/personnels";
import { useToasts } from "react-toast-notifications";
import { isEqual } from "lodash";
import { fullName, properFullname } from "../../../../../../services/utilities";

export default function Modal() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { showModalTeam, willCreateTeam, isLoading } = useSelector(
    ({ quest }) => quest
  );
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const { company } = useSelector(({ personnels }) => personnels);
  const { team: selected } = useSelector(({ quest }) => quest);

  const [form, setForm] = useState(selected);
  const [member, setMember] = useState();
  const [branch, setBranch] = useState();

  // ✅ Sync Redux selected to local form state
  useEffect(() => {
    setForm(selected);
  }, [selected]);

  // ✅ Load company data (once)
  useEffect(() => {
    if (token && activePlatform?.branch?.companyId?._id) {
      dispatch(
        COMPANY({
          token,
          params: { companyId: activePlatform.branch.companyId._id },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  // ✅ Handle form input changes
  const handleChange = (key, value) => {
    console.log(key, value);

    setForm((prev) => ({
      ...prev,
      [key]: value,
      branchId: activePlatform.branchId,
    }));
  };
  const handleMember = (member) => {
    if (member === "inhouse") {
      const _company = company.filter(
        ({ _id }) => _id === activePlatform?.branchId
      );
      const selected = _company[0]; // Get the first match

      setMember(selected?.personnels || []); // fallback to empty array
    } else if (member === "collaboration") {
      setBranch();
    }
  };

  // ✅ Handle update
  const handleUpdate = () => {
    dispatch(TOGGLETeam());

    if (isEqual(form, selected?.team)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...form, _id: selected?._id },
        token,
      })
    );
  };
  console.log("selected", selected);

  // ✅ Handle add member (FIXED)
  const handleAdd = () => {
    const safeTeam = Array.isArray(selected?.team) ? selected?.team : [];
    const newTeam = [...safeTeam, form];
    console.log("selected", selected);
    console.log("safeTeam", safeTeam);
    console.log("newTeam", newTeam);

    dispatch(
      UPDATE({
        data: { _id: selected._id, team: newTeam },
        token,
      })
    ).then(() => dispatch(TOGGLETeam()));
  };

  // ✅ Handle form submission (uses above)
  const handleSubmit = (e) => {
    e.preventDefault();
    willCreateTeam ? handleAdd() : handleUpdate();
  };

  // ✅ Close modal
  const handleClose = () => dispatch(TOGGLETeam());

  return (
    <MDBModal isOpen={showModalTeam} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreateTeam ? "Add" : "Update"} Member
      </MDBModalHeader>

      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <MDBTypography tag="h5" className="text-center mb-4">
            {form?.user ? properFullname(form.user.fullName) : "Member Details"}
          </MDBTypography>

          <MDBRow className="mb-3">
            <MDBCol>
              <MDBInput
                label="Inhouse"
                type="radio"
                id="inhouse"
                checked={form?.type === "inhouse"}
                onClick={() => {
                  handleChange("type", "inhouse");
                  handleMember("inhouse");
                }}
              />
              <MDBInput
                label="Collaboration"
                type="radio"
                id="collaboration"
                checked={form?.type === "collaboration"}
                onClick={() => {
                  handleChange("type", "collaboration");
                  handleMember("collaboration");
                }}
              />
              <MDBInput
                label="Import"
                type="radio"
                id="import"
                checked={form?.type === "import"}
                onClick={() => {
                  handleChange("type", "import");
                  handleMember("import");
                }}
              />
            </MDBCol>
          </MDBRow>
          {form.type === "inhouse" && (
            <select
              name="userId"
              // value={selected}
              onChange={() => handleChange()}
              id=""
              className="form-control"
            >
              <option />
              {member?.map((m, index) => (
                <option key={`${index}-personnel`} value={m?.user?._id}>
                  {fullName(m?.user?.fullName)}
                </option>
              ))}
            </select>
          )}
          {/* {form?.user && (
            <div className="mb-2">
              <label>Alias: {form.user.alias}</label>
            </div>
          )}

          <MDBInput
            label="Name"
            type="text"
            value={form?.fullName || ""}
            required
            onChange={(e) => handleChange("fullName", e.target.value)}
          /> */}

          <MDBInput
            label="Role"
            type="text"
            value={form?.role || ""}
            required
            onChange={(e) => handleChange("role", e.target.value)}
          />
          <MDBInput
            label="Phone Number"
            type="text"
            value={form?.phoneNumber || ""}
            required
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />

          <label>Inform</label>
          <select
            className="form-control mb-3"
            value={
              form?.hasInformed === true
                ? "true"
                : form?.hasInformed === false
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

          <div className="text-center">
            <MDBBtn type="submit" disabled={isLoading} color="info" rounded>
              {willCreateTeam ? "Add" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

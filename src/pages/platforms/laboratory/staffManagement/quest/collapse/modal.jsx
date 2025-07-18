import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
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
import { fullName } from "../../../../../../services/utilities";

export default function Modal() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { showModalTeam, willCreateTeam, isLoading } = useSelector(
    ({ quest }) => quest
  );
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { company } = useSelector(({ personnels }) => personnels);
  const { team: selected } = useSelector(({ quest }) => quest);

  const [form, setForm] = useState();
  const [member, setMember] = useState();
  const [branch, setBranch] = useState();

  useEffect(() => {
    setForm({
      type: "inhouse",
    });
    const _company = company.filter(
      ({ _id }) => _id === activePlatform?.branchId
    );
    const _selected = _company[0];

    setMember(_selected?.personnels || []);
  }, [activePlatform, company, selected]);

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

  const handleChange = (key, value) => {
    if (key === "userId") {
      const _val = JSON.parse(value);
      setForm((prev) => ({
        ...prev,
        userId: _val?._id,
      }));
    }
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMember = (member) => {
    if (member === "inhouse") {
      const _company = company.filter(
        ({ _id }) => _id === activePlatform?.branchId
      );
      const selected = _company[0];
      setMember(selected?.personnels || []);
    } else if (member === "collaboration") {
      setBranch();
    }
  };

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

  const handleAdd = () => {
    const safeTeam = Array.isArray(selected?.team) ? selected.team : [];
    const newTeam = [...safeTeam, form];
    console.log("form", form);

    // dispatch(
    //   UPDATE({
    //     data: { _id: selected._id, team: newTeam },
    //     token,
    //   })
    // ).then(() => dispatch(TOGGLETeam()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    willCreateTeam ? handleAdd() : handleUpdate();
  };

  const handleClose = () => dispatch(TOGGLETeam());

  return (
    <MDBModal isOpen={showModalTeam} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreateTeam ? "Tag" : "Update"} Member
      </MDBModalHeader>

      <MDBModalBody>
        <form onSubmit={handleSubmit}>
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

          {form?.type === "inhouse" && (
            <select
              name="userId"
              onChange={(e) => handleChange("userId", e.target.value)}
              className="form-control"
            >
              <option />
              {member?.map((m, index) => (
                <option
                  key={`${index}-personnel`}
                  value={JSON.stringify(m?.user)}
                >
                  {fullName(m?.user?.fullName)}
                </option>
              ))}
            </select>
          )}

          <MDBInput
            label="Role"
            type="text"
            value={form?.role || ""}
            required
            onChange={(e) => handleChange("role", e.target.value)}
          />

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

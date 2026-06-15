import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";
import {
  SAVE,
  TOGGLE,
  SETPHYSICIAN,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";
import { SearchUser } from "../../../../../../components/searchables";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading, displayName } =
      useSelector(({ physicians }) => physicians),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    [user, setUser] = useState({}),
    [registerCandidate, setRegisterCandidate] = useState(null),
    [showGhostFields, setShowGhostFields] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected && Object.keys(selected).length > 0) {
      const ghostFullName = selected?.ghostName?.fullName || {};

      setForm({
        ...selected,
        lname: ghostFullName?.lname || "",
        fname: ghostFullName?.fname || "",
      });
      setUser(selected?.user || {});
      setRegisterCandidate(null);
      setShowGhostFields(!selected?.user?._id);
    } else {
      setForm({});
      setUser({});
      setShowGhostFields(false);
      setRegisterCandidate(null);
    }
  }, [selected, displayName]);

  const buildData = () => {
    if (user._id) {
      // Registered physician
      return {
        branch: activePlatform.branchId,
        user: user._id,
      };
    } else {
      // Ghost physician
      return {
        user: form.user,
        branch: activePlatform.branchId,
        ghostName: {
          fullName: {
            fname: String(form.fname || "").trim(),
            mname: "",
            lname: String(form.lname || "").trim(),
          },
        },
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user._id && !showGhostFields) {
      return addToast(
        "Search and select a physician first, or use register for a ghost physician.",
        {
          appearance: "warning",
        },
      );
    }

    if (
      !user._id &&
      (!String(form.lname || "").trim() || !String(form.fname || "").trim())
    ) {
      return addToast(
        "Please enter both last name and first name for the ghost physician.",
        { appearance: "error" },
      );
    }

    const fullData = buildData();

    if (willCreate) {
      const isGhost = !Boolean(user._id);
      dispatch(
        SAVE({
          data: { ...fullData, isGhost, branchId: activePlatform?.branchId }, // contains `user` field
          token,
        }),
      ).then(() => {
        addToast(
          isGhost
            ? "Ghost physician saved successfully."
            : "Registered physician saved successfully.",
          {
            appearance: "success",
          },
        );
        dispatch(TOGGLE());
      });
    }
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleValue = (key) => form?.[key] || "";
  const handlePhysicians = (physician) => {
    setUser(physician);
    setRegisterCandidate(null);
    setShowGhostFields(false);
    setForm({});
    dispatch(SETPHYSICIAN(physician));
  };

  const handleRegister = (name) => {
    setUser({});
    setRegisterCandidate(name);
    setShowGhostFields(true);
    setForm((prev) => ({
      ...prev,
      lname: prev?.lname || name?.lname || "",
      fname: prev?.fname || name?.fname || "",
    }));

    console.log("Registering ghost physician with name:", name);
  };

  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={TOGGLE} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Tag" : "Update"} Physician
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <label>
            <strong>Search Physician</strong>
          </label>

          <SearchUser
            setPatient={handlePhysicians}
            setRegister={handleRegister}
            notFoundMessage="No physician record found."
          />
          {user?._id && (
            <div className="mt-2 mb-2 text-primary">
              Selected registered physician: {displayName}
            </div>
          )}
          {showGhostFields && (
            <>
              <MDBInput
                label="Last Name"
                type="text"
                value={handleValue("lname")}
                required
                onChange={(e) => handleChange("lname", e.target.value)}
              />
              <MDBInput
                label="First Name"
                type="text"
                value={handleValue("fname")}
                required
                onChange={(e) => handleChange("fname", e.target.value)}
              />
              {registerCandidate && (
                <small className="d-block mt-n2 mb-3 text-muted">
                  Ghost physician mode: no existing user record was selected.
                </small>
              )}
            </>
          )}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

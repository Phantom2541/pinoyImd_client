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
    [showInputFields, setShowInputFields] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected && Object.keys(selected).length > 0) {
      setForm({
        ...selected,
        fullName: displayName || "",
      });
      setShowInputFields(true);
    } else {
      setForm({});
      setShowInputFields(false);
    }
  }, [selected, displayName]);

  const splitFullName = (fullName) => {
    if (!fullName.includes(",")) {
      return { fname: "", mname: "", lname: fullName.trim() };
    }

    const [lastName, rest] = fullName.split(",").map((s) => s.trim());
    const parts = rest.split(/\s+/);
    const mname = parts.length > 1 ? parts[parts.length - 1] : "";
    const fname = parts.slice(0, -1).join(" ");

    return { fname, mname, lname: lastName };
  };

  const buildData = () => {
    const { fname, mname, lname } = splitFullName(form.fullName || "");
    if (user._id) {
      // Registered physician
      return {
        title: form.title,
        postnominal: form.postnominal,
        suffix: form.suffix,
        branch: activePlatform.branchId,
        user: user._id,
      };
    } else {
      // Ghost physician
      return {
        title: form.title,
        user: form.user,
        branch: activePlatform.branchId,
        ghostName: {
          fname,
          mname,
          lname,
          suffix: form.suffix,
          postnominal: form.postnominal,
        },
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName?.includes(",")) {
      return addToast(
        "Please enter name in the format: Lastname, Firstname Middlename",
        { appearance: "error" }
      );
    }

    const fullData = buildData();

    if (willCreate) {
      const isGhost = !Boolean(user._id);
      dispatch(
        SAVE({
          data: { ...fullData, isGhost, branchId: activePlatform?.branchId }, // contains `user` field
          token,
        })
      ).then(() => {
        addToast(
          isGhost
            ? "Ghost physician saved successfully."
            : "Registered physician saved successfully.",
          {
            appearance: "success",
          }
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
    dispatch(SETPHYSICIAN(physician));
  };

  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={TOGGLE} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Services
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <label>
            <strong>Search Physician</strong>
          </label>

          <SearchUser setPatient={handlePhysicians} />
          {showInputFields && (
            <>
              <MDBInput
                label="Title (e.g., Dr., Mr.)"
                type="text"
                value={handleValue("title")}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              <MDBInput
                label="Full Name (Format: Lastname, Firstname Middlename)"
                type="text"
                value={handleValue("fullName")}
                required
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              <MDBInput
                label="Post-nominal (e.g., MD)"
                type="text"
                value={handleValue("postnominal")}
                onChange={(e) => handleChange("postnominal", e.target.value)}
              />
              <MDBInput
                label="Suffix (e.g., Jr., Sr.)"
                type="text"
                value={handleValue("suffix")}
                onChange={(e) => handleChange("suffix", e.target.value)}
              />
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

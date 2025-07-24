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
  UPDATE,
  TOGGLE,
  SETPHYSICIAN,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { SearchUser } from "../../../../../../components/searchables";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading, displayName } =
      useSelector(({ physicians }) => physicians),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
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
    console.log("form", form);

    if (form.user) {
      // Registered physician
      return {
        title: form.title,
        postnominal: form.postnominal,
        suffix: form.suffix,
        branch: activePlatform.branchId,
        user: form.user,
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

  const handleUpdate = () => {
    TOGGLE();
    const fullData = buildData();
    if (isEqual(fullData, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...fullData, _id: selected._id },
        token,
      })
    );
  };

  const handleCreate = () => {
    const fullData = buildData();
    console.log("fullData", fullData);

    // dispatch(
    //   SAVE({
    //     data: fullData,
    //     token,
    //   })
    // ).then(() => dispatch(TOGGLE()));
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
      // Registered physician
      if (form.user) {
        console.log("fullData", fullData);
        dispatch(
          SAVE({
            data: fullData, // contains `user` field
            token,
          })
        ).then(() => {
          addToast("Registered physician saved successfully.", {
            appearance: "success",
          });
          dispatch(TOGGLE());
        });
      } else {
        console.log("fullData", fullData);

        // Ghost physician
        // dispatch(
        //   SAVE({
        //     data: fullData, // contains `ghostName` field
        //     token,
        //   })
        // ).then(() => {
        //   addToast("Ghost physician saved successfully.", {
        //     appearance: "info",
        //   });
        //   dispatch(TOGGLE());
        // });
      }
      return;
    }

    // Update existing record
    handleUpdate();
    handleCreate();
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleValue = (key) => form?.[key] || "";
  const handlePhysicians = (physician) => {
    console.log("physician", physician);

    setForm({
      ...form,
      user: physician._id,
    });
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

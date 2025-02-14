import React, { useEffect, useState } from "react";
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
  SAVE,
  UPDATE,
} from "../../../../services/redux/slices/assets/companies";
import { BROWSE } from "../../../../services/redux/slices/assets/persons/users";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import CustomSelect from "../../../../components/customSelect";
import { fullName } from "../../../../services/utilities";

// declare your expected items
const _form = {
  name: "",
  subName: "",
  category: "",
  ceo: "",
};

var category = [
  {
    name: "Supplier",
    value: "supplier",
  },
  {
    name: "Labaratory",
    value: "laboratory",
  },
  {
    name: "Outsource",
    value: "outsource",
  },
  {
    name: "Insource",
    value: "insource",
  },
  {
    name: "Support",
    value: "support",
  },
  {
    name: "Clinic",
    value: "clinic",
  },
  {
    name: "Infirmary",
    value: "infirmary",
  },
];

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, auth } = useSelector(({ auth }) => auth),
    [users, setUsers] = useState([]),
    { collections } = useSelector(({ users }) => users),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if ((show, token)) {
      dispatch(BROWSE({ token }));
    }
  }, [dispatch, show, token]);

  useEffect(() => {
    if (show) {
      setUsers(collections);
    }
  }, [show, collections]);

  useEffect(() => {
    if (!willCreate && selected._id) {
      setForm(selected);
    }
  }, [selected, willCreate]);

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
        data: form,
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
  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) =>
    setForm({ ...form, [key]: value, ceo: auth._id });

  const handleChangeCeo = (ceo) => {
    setForm({ ...form, ceo: auth._id });
  };
  const handleChangeCategory = (category) => {
    setForm({ ...form, category });
  };
  console.log(form);
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="building" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Branch"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Name"
                value={handleValue("name")}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Sub Name"
                value={handleValue("subName")}
                onChange={(e) => handleChange("subName", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <CustomSelect
                choices={category}
                preValue={selected.category && selected.category}
                label="Category"
                texts="name"
                values="value"
                onChange={handleChangeCategory}
              />
            </MDBCol>
            <MDBCol md="6">
              <CustomSelect
                choices={users}
                onChange={handleChangeCeo}
                preValue={selected._id ? fullName(selected?.ceo?.fullName) : ""}
                label="Chief Executive Officer"
                texts="fullName"
                isNameOfPerson={true}
                values="_id"
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

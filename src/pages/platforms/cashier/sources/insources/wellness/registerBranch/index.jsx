import { useState, useEffect, useCallback } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBTypography,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";

import AddressSelect from "../../../../../../../components/searchables/addressSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  REGISTER_BRANCH,
  ToggleRegister,
  RESET,
  SetCATEGORY,
} from "../../../../../../../services/redux/slices/assets/providers";
import { Select } from "../../../../../../../components/customizable";
import Swal from "sweetalert2";

const _form = {
  name: "",
  displayname: "",
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "GENERAL TINIO (PAPAYA)",
    barangay: "Pias",
  },
};

export default function Modal() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    {
      formSubmitted,
      isSuccess,
      category: defaultCategory,
      categories,
      selected,
      showRegisterModal: show,
    } = useSelector(({ providers }) => providers),
    [form, setForm] = useState(_form),
    [category, setCategory] = useState(),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => {
    dispatch(ToggleRegister());
  }, [dispatch]);

  useEffect(() => {
    setCategory(defaultCategory);
    console.log("categories", categories);
  }, [defaultCategory, categories]);

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      dispatch(RESET());
      toggle();
      addToast("New provider added successfully.", {
        appearance: "success",
      });
    }
  }, [show, formSubmitted, isSuccess, dispatch, toggle, addToast]);

  useEffect(() => {
    if (show) {
      setForm((prev) => ({
        ...prev,
        name: selected?.name,
        displayname: selected?.displayname,
        abbr: selected?.abbr,
        providerId: selected?._id,
      }));
    }
  }, [show, selected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { branchId } = activePlatform;
    if (!category)
      return Swal.fire({
        icon: "warning",
        title: "Category is required!",
        text: "Please select a category before proceeding.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    dispatch(
      REGISTER_BRANCH({
        token,
        data: {
          branch: form,
          providerID: form?.providerId || "",
          category,
          vendors: branchId,
        },
      })
    );
    dispatch(SetCATEGORY(category));
  };

  const isGhost = selected?.providerID ? true : false;
  return (
    <MDBModal size="md" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="code-branch" className="mr-2" />
        {isGhost ? "Register Ghost Branch" : "Register Branch"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "-1rem", marginTop: "-1rem" }}>
            <MDBTypography
              variant="h6"
              noteColor="warning"
              className="mt-2 text-black-50"
              note
              noteTitle={"Notice: "}
            >
              This branch will be registered and set as your new provider.
            </MDBTypography>
          </div>

          <MDBRow className="mt-4">
            <MDBCol md="6">
              <Select
                label="Category"
                preValue={category}
                onChange={(e) => {
                  setForm({ ...form, category: e });
                  setCategory("wls");
                }}
                keys={"value"}
                values={"text"}
                collections={categories}
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                label="Name"
                required
                value={form.name?.toUpperCase()}
                onChange={({ target }) =>
                  setForm({ ...form, name: target.value })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow style={{ marginTop: "-1rem" }}>
            <MDBCol>
              <MDBInput
                label="Acronym"
                value={form?.abbr?.toUpperCase()}
                onChange={({ target }) =>
                  setForm({ ...form, abbr: target.value })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Branch Display name"
                required
                value={form?.displayname?.toUpperCase()}
                onChange={({ target }) =>
                  setForm({ ...form, displayname: target.value })
                }
              />
            </MDBCol>
          </MDBRow>

          <AddressSelect
            handleChange={(_, value) =>
              setForm((prev) => ({
                ...prev,
                address: { ...prev.address, ...value },
              }))
            }
            address={form.address}
          />
          <MDBBtn
            className="float-right mt-3"
            rounded
            type="submit"
            color="info"
            disabled={formSubmitted}
            onClick={handleSubmit}
          >
            Register
            {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

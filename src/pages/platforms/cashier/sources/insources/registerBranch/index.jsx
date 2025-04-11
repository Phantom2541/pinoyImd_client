import React, { useState, useEffect, useCallback } from "react";
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
import AddressSelect from "../../../../../../components/searchables/addressSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  REGISTER_BRANCH,
  ToggleRegister,
  RESET,
} from "../../../../../../services/redux/slices/assets/providers";

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
      selected,
      showRegisterModal: show,
    } = useSelector(({ providers }) => providers),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const toggle = useCallback(() => {
    dispatch(ToggleRegister());
  }, [dispatch]);

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      dispatch(RESET());
      toggle();
    }
  }, [show, formSubmitted, isSuccess, dispatch, toggle]);

  useEffect(() => {
    if (show) {
      setForm((prev) => ({
        ...prev,
        name: selected?.name,
        displayname: selected?.displayname,
        providerId: selected?._id,
      }));
    }
  }, [show, selected]);

  const handleSubmit = () => {
    const { branchId } = activePlatform;

    dispatch(
      REGISTER_BRANCH({
        token,
        data: {
          branch: form,
          providerID: form?.providerId || "",
          vendors: branchId,
        },
      })
    );
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

        <MDBRow>
          <MDBCol>
            <MDBInput
              label="Branch Display name"
              required
              value={form.displayname}
              onChange={({ target }) =>
                setForm({ ...form, displayname: target.value })
              }
            />
          </MDBCol>
          {form?.providerID && (
            <MDBCol>
              <MDBInput
                label="Name"
                value={form.name}
                onChange={({ target }) =>
                  setForm({ ...form, name: target.value })
                }
              />
            </MDBCol>
          )}
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
          color="info"
          disabled={formSubmitted}
          onClick={handleSubmit}
        >
          Register
          {formSubmitted && <MDBIcon icon="spinner" pulse className="ml-2" />}
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}

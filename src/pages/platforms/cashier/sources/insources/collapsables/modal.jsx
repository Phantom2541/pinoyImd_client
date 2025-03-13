import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";
import AddressSelect from "../../../../../../components/searchables/addressSelect";
import { useDispatch, useSelector } from "react-redux";
import { REGISTER_GHOST_COMPANY } from "../../../../../../services/redux/slices/assets/providers";
const _form = {
  name: "",
  companyName: "",
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "GENERAL TINIO (PAPAYA)",
    barangay: "Pias",
  },
};

export default function Modal({ show, toggle, selected }) {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const { branch } = activePlatform;
      const { companyId } = branch;
      const { name, _id } = companyId;
      setForm((prev) => ({
        ...prev,
        name: selected.name,
        companyName: name,
        companyId: _id,
        providerId: selected._id,
      }));
    }
  }, [show, selected, activePlatform]);

  const handleSubmit = () => {
    dispatch(
      REGISTER_GHOST_COMPANY({
        token,
        data: { branch: form, providerID: form.providerId },
      })
    );
  };

  return (
    <MDBModal size="md" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="building" className="mr-2" />
        {form.name} register as your new client
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol>
            <MDBInput label="Name" required value={form.name} />
          </MDBCol>
          <MDBCol>
            <MDBInput
              label="Comapny Name"
              required
              value={form.companyName}
              readOnly
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
          color="info"
          onClick={handleSubmit}
        >
          Register
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}

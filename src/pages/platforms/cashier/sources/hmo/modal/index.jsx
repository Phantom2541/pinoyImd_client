import { useEffect, useState } from "react";
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
  TOGGLE,
  SAVE,
} from "../../../../../../services/redux/slices/assets/providers";

// declare your expected items
const _form = {
  name: "",
  number: "",
  address: "",
};

export default function Modal() {
  const { showModal, isLoading, selected } = useSelector(
      ({ providers }) => providers
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE());
  useEffect(() => {
    if (showModal) {
      setForm(_form);
    }
  }, [showModal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      SAVE({
        token,
        data: {
          ...form,
          vendors: activePlatform.branchId,
          category: "hmo",
        },
      })
    );
    dispatch(TOGGLE());
  };

  // use for direct values like strings and numbers
  return (
    <MDBModal isOpen={showModal} toggle={toggle} size="md" backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon className="mr-2" icon="hospital" />
        Add HMO
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody className="mb-0">
          <MDBInput
            label="Name"
            value={form.name}
            onChange={({ target }) => setForm({ ...form, name: target.value })}
          />
          <MDBInput
            label="Phone Number"
            value={form.number}
            onChange={({ target }) =>
              setForm({ ...form, number: target.value })
            }
          />
          <MDBInput
            label="Address"
            value={form.address}
            onChange={({ target }) =>
              setForm({ ...form, address: target.value })
            }
          />

          <div className="d-flex justify-content-end mt-4">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              Submit
            </MDBBtn>
          </div>
        </MDBModalBody>
      </form>
    </MDBModal>
  );
}

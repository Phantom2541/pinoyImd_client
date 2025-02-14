import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBModalFooter,
  MDBRow,
  MDBCol,
} from "mdbreact";
// import { PAY_PAYABLE } from "../../../../../services/redux/slices/finance/payables";
import { capitalize, fullName } from "../../../../../services/utilities";
// import { PAYEES } from "../../../../../services/redux/slices/assets/persons/users";

// Initial form state for payables payment
const _form = {
  payee: "",
  amount: "",
  paymentDate: "",
};

export default function PayableModal({ show, toggle, selectedPayable }) {
  const { collections: payees } = useSelector(({ users }) => users),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(PAYEES({ token }));
    }
  }, [token, dispatch]);

  const handleSubmit = () => {
    // dispatch(
    //   PAY_PAYABLE({
    //     data: {
    //       ...form,
    //       payableId: selectedPayable._id, // ID of the payable being paid
    //     },
    //     token,
    //   })
    // );
    toggle();
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="lg"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="dollar-sign" className="mr-2" />
        Pay Payable
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div className="mt-3">
          <MDBRow className="mt-4">
            <MDBCol>
              <MDBInput
                type="number"
                label="Amount"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
                icon="money-bill"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="date"
                label="Payment Date"
                value={form.paymentDate}
                onChange={(e) => handleChange("paymentDate", e.target.value)}
                required
                icon="calendar"
              />
            </MDBCol>
          </MDBRow>
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <button onClick={handleSubmit} className="btn btn-success">
          Pay
        </button>
      </MDBModalFooter>
    </MDBModal>
  );
}

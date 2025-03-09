import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBTypography,
  MDBInput,
  MDBContainer,
  MDBCard,
  MDBCardBody,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
  SetCloseModal,
} from "../../../../../../services/redux/slices/finance/payables";
import { Statements } from "../../../../../../services/fakeDb";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function PaymentModal() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { showPaymentModal, selected, willCreate, isLoading } = useSelector(
    ({ payables }) => payables
  );
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);

  const [form, setForm] = useState(selected);

  useEffect(() => {
    setForm(selected);
  }, [selected, willCreate, showPaymentModal]);

  // Handle update function
  const handleUpdate = () => {
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    dispatch(UPDATE({ data: { ...form, _id: selected._id }, token }));
  };

  // Handle create function
  const handleCreate = () => {
    dispatch(SAVE({ data: form, token }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change in inputs
  const handleChange = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: key === "orOption" ? value : Number(value),
      userId: auth._id,
      branchId: activePlatform.branchId,
    }));
  };

  // Handle modal close
  const handleClose = () => dispatch(SetCloseModal(false));

  return (
    <MDBModal
      isOpen={showPaymentModal}
      toggle={handleClose}
      backdrop={false}
      size="md"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text text-center w-100"
      >
        Payments
      </MDBModalHeader>
      <MDBModalBody>
        <MDBContainer>
          <MDBCard className="shadow-3">
            <MDBCardBody>
              <form onSubmit={handleSubmit}>
                {/* Supplier Name */}
                <MDBTypography
                  // tag="h2"
                  variant="h4-responsive"
                  className="text-center mb-3"
                >
                  <small>Supplier: </small>
                  <strong> {selected?.supplier?.name || "N/A"}</strong>
                </MDBTypography>
                {/* Statement */}
                <MDBTypography
                  // tag="h6"
                  variant="h4-responsive"
                  className="text-center mb-3"
                >
                  <small>Statements: </small>
                  <strong>
                    {Statements?.getName(selected?.fsId) || "N/A"}
                  </strong>
                </MDBTypography>
                {/* Payment Method Dropdown */}
                <select
                  className="browser-default custom-select"
                  value={form.orOption || ""}
                  onChange={(e) => {
                    // console.log("New Value Selected:", e.target.value); // Debugging log
                    setForm({ ...form, orOption: e.target.value });
                  }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Gcash">Gcash</option>
                  <option value="Transfer">Transfer</option>
                </select>
                {/* Conditionally render the correct input based on selection */}
                {form.orOption === "Cash" ? (
                  <>
                    <br />
                    <MDBInput
                      type="number"
                      step="0.01"
                      // value={}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: e.target.value,
                        })
                      }
                      style={{
                        width: "50%",
                        margin: "0 auto",
                        display: "block",
                      }}
                    />
                  </>
                ) : form.orOption === "Cheque" ? (
                  <>
                    <br />
                    <h1>Cheque</h1>
                  </>
                ) : form.orOption === "Gcash" ? (
                  <>
                    <br />
                    <h1>Gcash</h1>
                  </>
                ) : form.orOption === "Transfer" ? (
                  <>
                    <br />
                    <h1>Transfer</h1>
                  </>
                ) : null}{" "}
                {/* Payment Method Dropdown */}
                {/* <div className="mb-3">
                  <label className="font-weight-bold">
                    Select Payment Method
                  </label>
                  <select
                    className="browser-default custom-select"
                    value={form.paymentMethod || ""}
                    onChange={(e) =>
                      handleChange("paymentMethod", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Payment Method
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Gcash">Gcash</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div> */}
                {/* Due Date */}
                <MDBTypography
                  tag="h2"
                  variant="h4-responsive"
                  className="text-center mt-4"
                >
                  Due Date:{" "}
                  {selected?.due
                    ? new Date(selected.due).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </MDBTypography>
                {/* Amount Input (Conditional) */}
                {form.orOption === "Partial" ? (
                  <MDBInput
                    label="Amount"
                    type="number"
                    value={form.amount || ""}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    className="mt-3"
                  />
                ) : (
                  <MDBTypography
                    tag="h4"
                    variant="h4-responsive"
                    className="text-center mt-3"
                  >
                    <strong>
                      Expenses Amount: {selected?.amount || "N/A"}
                    </strong>
                  </MDBTypography>
                )}
                {/* Submit Button */}
                <div className="text-center mt-4">
                  <MDBBtn
                    type="submit"
                    disabled={isLoading}
                    color="info"
                    rounded
                  >
                    {isLoading ? "Processing..." : "Pay"}
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
      </MDBModalBody>
    </MDBModal>
  );
}

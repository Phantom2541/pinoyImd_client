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
} from "../../../../../../services/redux/slices/finance/journals/payables";
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
  const [penalty, setPenalty] = useState(0);

  useEffect(() => {
    setForm(selected);
    checkPastDue();
  }, [selected, willCreate, showPaymentModal]);

  // Check if payment is past due
  const checkPastDue = () => {
    if (selected?.due) {
      const dueDate = new Date(selected.due);
      const today = new Date();
      if (dueDate < today) {
        setPenalty(0); // Default penalty value
      }
    }
  };

  // Handle input changes
  const handleChange = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: key === "orOption" ? value : Number(value),
      userId: auth._id,
      branchId: activePlatform.branchId,
    }));
  };

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

  // Handle modal close
  const handleClose = () => dispatch(SetCloseModal(false));

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

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
                  variant="h4-responsive"
                  className="text-center mb-3"
                >
                  <small>Supplier: </small>
                  <strong>{selected?.supplier?.name || "N/A"}</strong>
                </MDBTypography>

                {/* Statement */}
                <MDBTypography
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
                  className="browser-default custom-select mb-3"
                  value={form.orOption || ""}
                  onChange={(e) => handleChange("orOption", e.target.value)}
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Gcash">Gcash</option>
                  <option value="Transfer">Transfer</option>
                </select>

                {/* Conditional Payment Method Fields */}
                {form.orOption && (
                  <div className="text-center mt-3">
                    {form.orOption === "Cash" && (
                      <MDBInput
                        label="Enter Amount"
                        type="number"
                        step="0.01"
                        value={form.amount || ""}
                        onChange={(e) => handleChange("amount", e.target.value)}
                      />
                    )}
                    {form.orOption === "Cheque" && (
                      <h5>Cheque Payment Selected</h5>
                    )}
                    {form.orOption === "Gcash" && (
                      <h5>Gcash Payment Selected</h5>
                    )}
                    {form.orOption === "Transfer" && (
                      <h5>Transfer Payment Selected</h5>
                    )}
                  </div>
                )}

                {/* Due Date */}
                <MDBTypography
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

                {/* Penalty Input if Past Due */}
                {selected?.due && new Date(selected.due) < new Date() && (
                  <MDBInput
                    label="Penalty Amount"
                    type="number"
                    step="0.01"
                    value={penalty}
                    onChange={(e) => setPenalty(Number(e.target.value))}
                    className="mt-3"
                  />
                )}

                {/* Amount Display */}
                <MDBTypography
                  variant="h4-responsive"
                  className="text-center mt-3"
                >
                  <strong>
                    Expenses Amount: {formatCurrency(selected?.amount || 0)}
                  </strong>
                </MDBTypography>

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

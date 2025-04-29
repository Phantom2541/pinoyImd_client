import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBIcon,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
  TOGGLE,
} from "../../../../../../services/redux/slices/finance/journals/payables";
import "./style.css";
import { Statements } from "../../../../../../services/fakeDb";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import cash from "../../../../../../assets/paymentMethods/cash.png";
import transfer from "../../../../../../assets/paymentMethods/transfer.png";
import gcash from "../../../../../../assets/paymentMethods/gcash.png";
import cheque from "../../../../../../assets/paymentMethods/cheque.png";
import { currency, dateFormat } from "../../../../../../services/utilities";

const paymentMethods = [
  { text: "Cash", img: cash },
  { text: "Gcash", img: gcash },
  { text: "Transfer", img: transfer },
  { text: "Check", img: cheque },
];

export default function PaymentModal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showPaymentModal, selected, willCreate, isLoading } = useSelector(
      ({ payables }) => payables
    ),
    [form, setForm] = useState(selected),
    [penalty, setPenalty] = useState(0),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  // Check if payment is past due
  useEffect(() => {
    setForm({
      ...selected,
      orOption: selected?.orOption ? selected?.orOption : "Cash",
    });
    if (selected?.due) {
      const dueDate = new Date(selected.due);
      const today = new Date();
      if (dueDate < today) {
        setPenalty(0); // Default penalty value
      }
    }
  }, [selected, willCreate]);

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
    handleClose();
  };
  // Handle create function
  const handleCreate = () => {
    if (form.status === "accepted") {
      dispatch(
        UPDATE({
          data: {
            ...form,
            _id: selected._id,
            hasPaid: true,
            status: "paid",
          },
          token,
        })
      );
    } else {
      dispatch(SAVE({ data: form, token }));
    }
    handleClose();
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE(false));

  return (
    <MDBModal isOpen={showPaymentModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text text-center w-100"
      >
        <MDBIcon icon="money-bill-wave-alt" className="mr-2" /> Payment
      </MDBModalHeader>
      <MDBModalBody>
        <MDBCard>
          <MDBCardBody className="dashed-border-payment">
            <form onSubmit={handleSubmit}>
              {/* Supplier Name */}
              <div className="d-flex align-items-center">
                <h6 className="grey-text" style={{ marginRight: "2rem" }}>
                  Supplier:
                </h6>
                <h5 style={{ fontWeight: 500 }}>
                  {selected?.supplier?.name || "N/A"}
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <h6 className="grey-text mr-2">Statements:</h6>
                <h5 style={{ fontWeight: 500 }}>
                  {Statements?.getName(selected?.fsId) || "N/A"}
                </h5>
              </div>

              <h6 className="mt-2 grey-text">Payment Methods:</h6>
              <div className="d-flex align-items-center justify-content-center ">
                {paymentMethods.map(({ img, text }, index) => (
                  <MDBCard
                    key={index}
                    onClick={() => handleChange("orOption", text)}
                    className={`mr-2 d-flex align-items-center justify-content-center cursor-pointer ${
                      text === form.orOption
                        ? "active-payment-method"
                        : "payment-method"
                    }`}
                    style={
                      index === 3
                        ? {
                            height: "3.6rem",
                            width: "6rem ",
                            border: "red 2px solid black",
                          }
                        : {}
                    }
                  >
                    <img
                      style={{
                        width: index === 3 ? "5rem" : "6rem",
                        height: index === 3 ? "2.8rem" : "3.5rem",
                      }}
                      src={img}
                      alt={text}
                    />
                  </MDBCard>
                ))}
              </div>

              {form.orOption === "Cash" && (
                <MDBInput
                  label="Enter Amount"
                  type="number"
                  className="mt-2"
                  step="0.01"
                  value={form.amount || ""}
                  onChange={(e) => handleChange("amount", e.target.value)}
                />
              )}

              <div className="d-flex align-items-center mt-4">
                <h6 style={{ marginRight: "68.4px" }} className="grey-text">
                  Due Date:
                </h6>
                <h5 style={{ fontWeight: 500 }}>
                  {selected?.due ? dateFormat(selected.due) : "N/A"}
                </h5>
              </div>

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
              <div className="d-flex align-items-center">
                <h6 className="grey-text mr-1">Expenses Amount:</h6>
                <h5 style={{ fontWeight: 500 }}>
                  {currency(selected?.amount)}
                </h5>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-4">
                <MDBBtn type="submit" disabled={isLoading} color="info" rounded>
                  {isLoading ? "Processing..." : "Pay"}
                </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBModalBody>
    </MDBModal>
  );
}

import { useCallback, useEffect, useState } from "react";
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
  MDBDatePicker,
} from "mdbreact";
import { ToggleMODAL as TOGGLE } from "../../../../../services/redux/slices/finance/journals/soa";
import { useToasts } from "react-toast-notifications";
import cash from "../../../../../assets/paymentMethods/cash.png";
import transfer from "../../../../../assets/paymentMethods/transfer.png";
import gcash from "../../../../../assets/paymentMethods/gcash.png";
import cheque from "../../../../../assets/paymentMethods/cheque.png";
import { currency } from "../../../../../services/utilities";
import "./style.css";

const paymentMethods = [
  { text: "Cash", img: cash },
  { text: "Gcash", img: gcash },
  { text: "Transfer", img: transfer },
  { text: "Cheque", img: cheque },
];

export default function PaymentModal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate } = useSelector(({ soa }) => soa),
    [form, setForm] = useState(selected),
    [penalty, setPenalty] = useState(0),
    dispatch = useDispatch();

  // Handle modal close
  const handleClose = useCallback(() => {
    dispatch(TOGGLE(false));
  }, [dispatch]);

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

  // Handle create function

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
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
              <div className="d-flex align-items-center">
                <h6 className="grey-text mr-2">Client:</h6>
                <h5 style={{ fontWeight: 400 }}>{selected?.clientId?.name}</h5>
              </div>
              <div className="d-flex align-items-center">
                <h6 className="grey-text mr-2">Amount:</h6>
                <h5 style={{ fontWeight: 400 }}>
                  {currency(selected?.amount)}
                </h5>
              </div>
              <div className="d-flex align-items-center">
                <h6 className="grey-text mr-2">Remaining:</h6>
                <h5 style={{ fontWeight: 400 }} className="text-danger">
                  {currency(selected?.amount)}
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

              <MDBInput
                label="Enter Amount"
                type="number"
                className="mt-2"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
              {form.orOption === "Cheque" && (
                <>
                  <MDBInput
                    label="Cheque No."
                    type="number"
                    className="mt-2"
                    step="0.01"
                    value={form.chequeNo || ""}
                    onChange={(e) => handleChange("chequeNo", e.target.value)}
                  />
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="grey-text">Clearing Date:</span>
                    <MDBDatePicker
                      className=" m-0 p-0"
                      style={{ width: "19rem" }}
                    />
                  </div>
                </>
              )}
              <div className="text-center mt-4">
                <MDBBtn type="submit" color="info" rounded>
                  Pay
                  {/* <MDBIcon icon="spinner" pulse className="ml-2" /> */}
                </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBModalBody>
    </MDBModal>
  );
}

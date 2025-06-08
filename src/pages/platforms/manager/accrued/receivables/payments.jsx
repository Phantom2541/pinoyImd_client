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
import cash from "../../../../../assets/paymentMethods/cash.png";
import transfer from "../../../../../assets/paymentMethods/transfer.png";
import gcash from "../../../../../assets/paymentMethods/gcash.png";
import cheque from "../../../../../assets/paymentMethods/cheque.png";
import { currency } from "../../../../../services/utilities";
import "./style.css";
import { UPDATE } from "../../../../../services/redux/slices/finance/journals/soa";
import Spinner from "../../../../../components/spinner";

const paymentMethods = [
  { text: "Cash", img: cash },
  { text: "Gcash", img: gcash },
  { text: "Transfer", img: transfer },
  { text: "Cheque", img: cheque },
];

const _form = {
  method: "cash",
  amount: 0,
  chequeNo: "",
  clearDate: new Date(),
};
export default function PaymentModal() {
  const { token } = useSelector(({ auth }) => auth),
    { showModal, selected, formSubmitted } = useSelector(({ soa }) => soa),
    [form, setForm] = useState(_form),
    [totalPaidAmount, setTotalPaidAmount] = useState(0),
    dispatch = useDispatch();

  // Handle modal close
  const handleClose = useCallback(() => {
    dispatch(TOGGLE(false));
  }, [dispatch]);

  useEffect(() => {
    if (showModal) {
      const { payments } = selected;
      const _total = [...payments].reduce((a, b) => a + b.amount, 0);
      setTotalPaidAmount(_total);
    }
  }, [showModal, selected]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const { method, amount, chequeNo, clearDate } = form;
    const remaining = selected.amount - (totalPaidAmount + amount);
    dispatch(
      UPDATE({
        token,
        data: {
          _id: selected?._id,
          status: remaining === 0 ? "settled" : "partial",
          method,
          amount,
          createdAt: new Date(),
          ...(method === "cheque" && { chequeNo, clearDate }),
        },
      })
    );
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
                  {currency(selected?.amount - totalPaidAmount)}
                </h5>
              </div>

              <h6 className="mt-2 grey-text">Payment Methods:</h6>
              <div className="d-flex align-items-center justify-content-center ">
                {paymentMethods.map(({ img, text }, index) => (
                  <MDBCard
                    key={`paymentMethods-${index}-${text}`}
                    onClick={() => setForm({ ...form, method: text })}
                    className={`mr-2 d-flex align-items-center justify-content-center cursor-pointer ${
                      text === form.method
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
                value={String(form.amount) || ""}
                onChange={({ target }) =>
                  setForm({ ...form, amount: Number(target.value) })
                }
              />
              {form.method === "Cheque" && (
                <>
                  <MDBInput
                    label="Cheque No."
                    type="number"
                    className="mt-2"
                    step="0.01"
                    value={form.chequeNo || ""}
                    onChange={({ target }) =>
                      setForm({ ...form, chequeNo: target.value })
                    }
                  />
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="grey-text">Clearing Date:</span>
                    <MDBDatePicker
                      valueDefault={form.clearDate}
                      getValue={(value) =>
                        setForm({ ...form, clearDate: value })
                      }
                      className=" m-0 p-0"
                      style={{ width: "19rem" }}
                    />
                  </div>
                </>
              )}
              <div className="text-center mt-4">
                <MDBBtn type="submit" color="info" rounded>
                  Pay
                  <Spinner formSubmitted={formSubmitted} />
                </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBModalBody>
    </MDBModal>
  );
}

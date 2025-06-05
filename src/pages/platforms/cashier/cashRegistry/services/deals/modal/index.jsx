import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { currency } from "../../../../../../../services/utilities";
import { CENSUS } from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";

export default function Modal({ show, selected, toggle }) {
  const { token } = useSelector(({ auth }) => auth),
    { total, collections } = useSelector(({ deals }) => deals),
    { selected: selectedRemittance } = useSelector(
      ({ remittances }) => remittances
    ),
    { filtered = [] } = useSelector(({ payments }) => payments),
    [expenses, setExpenses] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    console.log("filtered", filtered);

    if (filtered.length > 0) {
      const amount =
        filtered?.reduce((sum, voucher) => sum + voucher.amount, 0) || 0;
      console.log("filtered", filtered);
      console.log("amount", amount);

      setExpenses(amount);
    }
  }, [filtered]);
  const paymentTotals = useMemo(() => {
    return collections?.reduce(
      (acc, payment) => {
        acc[payment.payment] = (acc[payment.payment] || 0) + payment.amount;
        return acc;
      },
      { cash: 0, gcash: 0, voucher: 0, pending: 0 }
    );
  }, [collections]);

  const handleClose = () => toggle();

  const { cash, ...rest } = paymentTotals;

  const nonCash = Object.entries(rest).filter(([_, value]) => value > 0);
  const fc = selectedRemittance?.opening?.sum;
  const sales = total;
  const coh = cash + fc - expenses;
  const { patient = 0 } = selected;

  const handleSubmit = () => {
    dispatch(CENSUS({ token, data: { ...selected, coh, sales } })).then(() => {
      toggle();
      addToast("End-of-Shift Summary saved successfully.", {
        appearance: "success",
      });
    });
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="cash-register" className="mr-2" />
        Remittance
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div className="d-flex align-items-center justify-content-between">
          <h5
            className={`mb-0 text-right `}
            style={{ whiteSpace: "nowrap", fontWeight: 400 }}
          >
            Patients:
          </h5>

          <div
            style={{
              flexGrow: 1,
              borderBottom: "1px dashed #999",
              margin: "0 10px",
            }}
          />

          <h5
            className={`mb-0 text-right`}
            style={{ whiteSpace: "nowrap", fontWeight: 400 }}
          >
            {patient} <MDBIcon icon="users" className="ml-1" />
          </h5>
        </div>
        {sales > 0 && (
          <div className="d-flex align-items-center justify-content-between">
            <h5
              className={`mb-0 text-right `}
              style={{ whiteSpace: "nowrap", fontWeight: 400 }}
            >
              Sales:
            </h5>

            <div
              style={{
                flexGrow: 1,
                borderBottom: "1px dashed #999",
                margin: "0 10px",
              }}
            />

            <h5
              className={`mb-0 text-right`}
              style={{ whiteSpace: "nowrap", fontWeight: 400 }}
            >
              {currency(sales)}
            </h5>
          </div>
        )}
        {nonCash.length > 0 && (
          <div className="mb-1">
            <div
              className="d-flex align-items-center "
              style={{ marginBottom: "-10px" }}
            >
              <h6
                style={{
                  whiteSpace: "nowrap",
                  fontWeight: 400,
                }}
              >
                Non-Cash:
              </h6>
            </div>
            {nonCash.map(([key, value], idx) => (
              <div
                key={idx}
                style={{ fontSize: "0.5rem" }}
                className="d-flex align-items-center justify-content-between ml-3 mt-1"
              >
                <h5
                  className={`mb-0 text-right `}
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "1rem",
                    color: "green",
                    fontWeight: 400,
                  }}
                >
                  {key}:
                </h5>

                <div
                  style={{
                    flexGrow: 1,
                    borderBottom: "1px dashed #999",
                    margin: "0 10px",
                  }}
                />

                <h5
                  className={`mb-0 text-right `}
                  style={{
                    whiteSpace: "nowrap",
                    fontWeight: 400,
                    color: "green",
                    fontSize: "1rem",
                  }}
                >
                  {currency(value)}
                </h5>
              </div>
            ))}
          </div>
        )}

        {[
          { label: "Cash Sales:", value: cash },
          {
            label: " Add: FC",
            value: fc,
            title: "Floating Cash",
          },

          { label: "Expenses", value: expenses, cn: "text-danger" },
        ]
          .filter(({ value }) => value > 0)
          .map(({ label, value, cn, title = "" }, idx) => (
            <div
              className="d-flex align-items-center justify-content-between "
              key={idx}
            >
              <h5
                className={`mb-0 text-right ${cn}`}
                style={{ whiteSpace: "nowrap", fontWeight: 400 }}
              >
                {label}:
              </h5>

              <div
                style={{
                  flexGrow: 1,
                  borderBottom: "1px dashed #999",
                  margin: "0 10px",
                }}
              />

              <h5
                className={`mb-0 text-right ${cn}`}
                style={{ whiteSpace: "nowrap", fontWeight: 400 }}
              >
                {currency(value)}
              </h5>
            </div>
          ))}

        <div
          style={{
            flexGrow: 1,
            borderBottom: "1px dashed black",
          }}
          className="mt-2"
        />

        <div className="d-flex align-items-center justify-content-between mt-2">
          <h5
            className={`mb-0 text-right fw-bold `}
            style={{ whiteSpace: "nowrap", color: "green" }}
            title="Gross = Cash Sales + Floating Cash - Expenses"
          >
            COH:
          </h5>

          <h5
            className={`mb-0 text-right fw-bold`}
            style={{ whiteSpace: "nowrap", color: "green" }}
          >
            {currency(coh)}
          </h5>
        </div>
        <div className="d-flex justify-content-center">
          <MDBBtn
            className="mt-4"
            rounded
            color="primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}

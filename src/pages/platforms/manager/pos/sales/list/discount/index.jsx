import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
} from "mdbreact";
import {
  MANAGERUPDATE,
  ToggleDiscountModal,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { currency, fullName } from "../../../../../../../services/utilities";

export default function Discount() {
  const { token, auth } = useSelector(({ auth }) => auth),
    {
      showDiscountModal: show,
      selected,
      formSubmitted,
      isSuccess,
    } = useSelector(({ deals }) => deals),
    [newAmount, setNewAmount] = useState(0),
    dispatch = useDispatch();
  const toggle = React.useCallback(
    () => dispatch(ToggleDiscountModal()),
    [dispatch]
  );

  useEffect(() => {
    if (show) {
      setNewAmount("");
    }
  }, [show]);

  useEffect(() => {
    if (!formSubmitted && isSuccess && show) {
      toggle();
    }
  }, [formSubmitted, isSuccess, dispatch, show, toggle]);

  const { discount, amount, _id, customerId } = selected;
  const originalAmount = discount ? discount + amount : amount;
  const newDiscount = originalAmount - newAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const noDiscount = originalAmount === newAmount;

    if (!noDiscount) {
      dispatch(
        MANAGERUPDATE({
          token,
          key: {
            _id,
            amount: newAmount,
            discount: originalAmount - newAmount,
            authorizedBy: auth._id,
          },
        })
      );
    } else {
      toggle();
    }
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(customerId?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <MDBTypography
              variant="h6"
              noteColor="primary"
              className="mt-2 text-black-50"
              note
              noteTitle={discount ? "Original Amount" : "Amount"}
            ></MDBTypography>

            <div
              style={{ flex: 1, borderBottom: "1px dashed black" }}
              className="mr-1"
            ></div>
            <p style={{ fontSize: "1.5rem", margin: "0 0px" }}>
              {currency(originalAmount)}
            </p>
          </div>
          {discount ? (
            <>
              <div
                style={{
                  display: "flex",
                  marginTop: "-2rem",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <MDBTypography
                  variant="h2"
                  noteColor="warning"
                  className="mt-2 text-black-50"
                  note
                  noteTitle={"Discounted Amount"}
                ></MDBTypography>

                <div
                  style={{ flex: 1, borderBottom: "1px dashed black" }}
                  className="mr-1"
                ></div>
                <p style={{ fontSize: "1.5rem", margin: "0 0px" }}>
                  {currency(discount)}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-2rem",
                  width: "100%",
                }}
              >
                <MDBTypography
                  variant="h2"
                  noteColor="success"
                  className="mt-2 text-black-50"
                  note
                  noteTitle={"Final Amount"}
                ></MDBTypography>

                <div
                  style={{ flex: 1, borderBottom: "1px dashed black" }}
                  className="mr-1"
                ></div>
                <p style={{ fontSize: "1.5rem", margin: "0 0px" }}>
                  {currency(originalAmount - discount)}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          <MDBInput
            label="Enter new Amount"
            style={{ marginTop: "-1.5rem" }}
            required
            value={String(newAmount)}
            onChange={({ target }) => {
              const _newAmount = Number(target.value);
              if (_newAmount > originalAmount) {
                setNewAmount(originalAmount);
              } else {
                setNewAmount(_newAmount);
              }
            }}
          />
          {newDiscount !== originalAmount && (
            <p style={{ fontWeight: 500, marginTop: "-1rem" }}>
              Total Discount Amount is: {currency(newDiscount)}
            </p>
          )}
          <MDBBtn
            className="float-right"
            rounded
            color="info"
            type="submit"
            disabled={formSubmitted}
          >
            Submit {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

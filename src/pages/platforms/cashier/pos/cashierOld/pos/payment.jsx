import React, { useState } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBInput,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBSwitch,
} from "mdbreact";
import { Payments, Categories } from "../../../../../../services/fakeDb";
import {
  capitalize,
  currency,
  computeGD,
} from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/commerce/sales";
import { UPDATE as PATIENTUPDATE } from "../../../../../../services/redux/slices/assets/persons/users";

export default function CashierPayment({
  patient,
  cart,
  sourceVendor,
  categoryIndex,
  gross,
  discount,
  physicianId,
  toggleModal,
  privilegeIndex,
}) {
  const [payment, setPayment] = useState(""),
    [isDeliver, setIsDeliver] = useState(false),
    [cash, setCash] = useState(0),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const { abbr = "" } = Categories[categoryIndex],
    paymentOptions = Payments[abbr],
    { _id, fullName, mobile, privilege, saleId = "", address } = patient;

  const handleSales = (authorizedBy) => {
    const net = gross - discount,
      _payment = payment || paymentOptions[0];
    // d = new Date(),
    // y = d.getFullYear(),
    // m = d.getMonth(),
    // a = d.getDate(),
    // h = d.getHours(),
    // t = d.getMinutes(),
    // s = d.getSeconds(),
    // mil = d.getMilliseconds();

    var data = {
      saleId: saleId || undefined,
      source: sourceVendor || undefined,
      physicianId: physicianId || undefined,
      authorizedBy: authorizedBy || undefined,
      branchId: activePlatform?.branchId,
      customerId: _id,
      cashierId: auth._id,
      category: categoryIndex === 0 ? "walkin" : abbr,
      payment: _payment,
      cash,
      amount: net,
      discount,
      isPickup: !isDeliver,
      // createdAt: `${y}-${m + 1}-${a}T${h}:${t}:${s}.${mil}+0800`,
      cart: cart.map((menu) => {
        const {
            description,
            abbreviation,
            packages = [],
            _id,
            isNew,
            up: soldUp,
            discount: soldDiscount,
          } = menu,
          { up, discount } = computeGD(menu, categoryIndex, privilegeIndex);

        return {
          description,
          abbreviation,
          packages,
          menuId: _id,
          isNew,
          up: isNew ? up : soldUp,
          discount: isNew ? soldDiscount : discount,
        };
      }),
      privilege: privilegeIndex,
      customer: {
        fullName,
        mobile,
        address: `${address?.barangay && `${address?.barangay}, `}${
          address?.city
        }`,
      },
      cashier: auth.fullName,
      isPrint: true,
    };

    if (privilege !== privilegeIndex)
      dispatch(
        PATIENTUPDATE({ token, data: { _id, privilege: privilegeIndex } })
      );

    toggleModal();

    if (saleId)
      return dispatch(
        UPDATE({
          token,
          data,
        })
      );

    dispatch(
      SAVE({
        token,
        data,
      })
    );
  };

  // const handleDiscountValidation = () => {
  //   //console.log("here");
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const balance = cash - (gross - discount);

    // if (privilegeIndex === 4) return handleDiscountValidation();

    if (balance < 0)
      return Swal.fire({
        icon: "error",
        title: "Invalid Transaction!",
        text: "Payment received is less than the total amount due.",
      });

    if (balance > 0)
      Swal.fire({
        icon: "info",
        title: `Change: ${currency(balance)}`,
        text: "Please return the change to the customer.",
      });

    handleSales();
  };

  return (
    <MDBCol md="3">
      <MDBAnimation type="slideInRight" duration={100}>
        <MDBCard>
          <MDBCardBody>
            <MDBCardText>Just a few more steps</MDBCardText>
            <form onSubmit={handleSubmit}>
              <MDBSelect
                getValue={(e) => setPayment(e[0])}
                className="colorful-select dropdown-primary"
              >
                <MDBSelectInput selected={capitalize(paymentOptions[0])} />
                <MDBSelectOptions>
                  {paymentOptions.map((payment, index) => (
                    <MDBSelectOption key={`payment-${index}`} value={payment}>
                      {capitalize(payment)}
                    </MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
              <div className="d-flex">
                <MDBSwitch
                  checked={isDeliver}
                  onChange={() => setIsDeliver(!isDeliver)}
                  labelLeft="Pickup"
                  labelRight="Delivery"
                  className="mx-auto mt-4 mb-0"
                />
              </div>
              <MDBInput
                required
                min={1}
                value={String(cash)}
                onChange={(e) => setCash(Number(e.target.value))}
                type="number"
                label="Received Amount"
              />
              <MDBBtn
                type="submit"
                color={
                  privilegeIndex === 4 ? "warning" : saleId ? "info" : "success"
                }
                className="w-100 mx-auto"
              >
                {saleId ? "Update" : "complete"} transaction
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBAnimation>
    </MDBCol>
  );
}

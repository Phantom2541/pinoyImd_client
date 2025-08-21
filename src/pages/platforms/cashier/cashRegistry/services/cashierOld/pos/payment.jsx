import React, { useEffect, useState } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBSwitch,
} from "mdbreact";
import { Payments, Categories } from "./../../../../../../../services/fakeDb";
import {
  capitalize,
  currency,
  computeGD,
} from "./../../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  SAVE,
  UPDATE,
  SetMODAL,
} from "./../../../../../../../services/redux/slices/commerce/pos/services/deals";

import { UPDATE as PATIENTUPDATE } from "./../../../../../../../services/redux/slices/assets/persons/users";

export default function CashierPayment({
  deals,
  cart,
  sourceVendor,
  categoryIndex,
  gross,
  discount,
  physicianId,
  toggleModal,
  privilegeIndex,
  overrideCart = [],
  amountPaid = 0,
  overrideDiscount = 0,
}) {
  const [payment, setPayment] = useState(""),
    [isDeliver, setIsDeliver] = useState(false),
    [cash, setCash] = useState(0),
    { formSubmitted = false, isSuccess = false } = useSelector(
      ({ deals: d }) => d
    ),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const { abbr = "" } = Categories[categoryIndex],
    paymentOptions = Payments[abbr],
    { customerId, _id: dealId } = deals,
    { _id, fullName, mobile, privilege, address } = customerId;
  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      const balance = cash - (gross - (discount + amountPaid));
      dispatch(SetMODAL(false));
      if (balance > 0)
        Swal.fire({
          icon: "info",
          title: `Change: ${currency.format(balance)}`,
          text: "Please return the change to the customer.",
        });
    }
  }, [isSuccess, formSubmitted, discount, gross, dispatch, cash, amountPaid]);
  const handleSales = (authorizedBy) => {
    const net = gross - (discount + amountPaid),
      _payment = payment || paymentOptions[0];
    const selectedMenus = [...cart].filter(({ isNew }) => isNew);
    const _department = [
      ...new Set(selectedMenus.flatMap((item) => item.department)),
    ];
    const department = [...new Set([...deals.department, ..._department])];
    const cartWithoutOverride = [...cart].filter(
      ({ overrideBy = "" }) => !overrideBy
    );
    var data = {
      dealId: dealId || undefined,
      source: sourceVendor || undefined,
      physicianId: physicianId || undefined,
      authorizedBy: authorizedBy || undefined,
      branchId: activePlatform?.branchId,
      customerId: _id,
      cashierId: auth._id,
      category: categoryIndex === 0 ? "wi" : abbr,
      payment: _payment,
      cash,
      amount: net,
      discount: discount - overrideDiscount,
      department,
      isPickup: !isDeliver,
      overrideCart: overrideCart.map(({ saleItemId }) => saleItemId),
      cart: cartWithoutOverride.map((menu) => {
        const {
            description,
            abbreviation,
            packages = [],
            _id,
            isNew,
            up: soldUp,
            discount: soldDiscount,
          } = menu,
          { up, discount = 0 } = computeGD(menu, categoryIndex, privilegeIndex);
        return {
          description,
          abbreviation,
          packages,
          menuId: _id,
          isNew,
          up: isNew ? up : soldUp,
          discount: isNew ? discount ?? 0 : soldDiscount,
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

    if (dealId)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const deduction = discount + amountPaid;
    const totalDeduction = gross - deduction;
    const balance = cash - totalDeduction;
    if (balance < 0)
      return Swal.fire({
        icon: "error",
        title: "Invalid Transaction!",
        text: "Payment received is less than the total amount due.",
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
                disabled={formSubmitted}
                color={
                  privilegeIndex === 4 ? "warning" : dealId ? "info" : "success"
                }
                className="w-100 mx-auto"
              >
                {dealId ? "Update" : "complete"} transaction{" "}
                {formSubmitted && (
                  <MDBIcon icon="spinner" pulse className="ml-2" />
                )}
              </MDBBtn>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBAnimation>
    </MDBCol>
  );
}

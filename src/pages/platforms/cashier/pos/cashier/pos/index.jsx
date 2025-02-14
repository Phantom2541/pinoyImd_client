import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import CashierMenu from "./menus";
import CashierPayment from "./payment";
import CashierPatient from "./patient";
import {
  computeGD,
  removeRedundantPackages,
} from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../../services/redux/slices/commerce/sales";
import { Categories } from "../../../../../../services/fakeDb";

export default function CashRegister({ show, toggle, patient }) {
  const [didCheckout, setDidCheckout] = useState(false),
    [categoryIndex, setCategoryIndex] = useState(0),
    [privilegeIndex, setPrivilegeIndex] = useState(0),
    [sourceVendor, setSourceVendor] = useState(""),
    [physicianId, setPhysicianId] = useState(""),
    [gross, setGross] = useState(0),
    [discount, setDiscount] = useState(0),
    [cart, setCart] = useState([]),
    { message, isSuccess } = useSelector(({ sales }) => sales),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    const { category, privilege, soldCart = [] } = patient;

    if (!!soldCart.length) setCart(soldCart);

    if (category)
      setCategoryIndex(
        category === "walkin"
          ? 0
          : Categories.findIndex(({ abbr }) => abbr === category)
      );
    if (privilege) setPrivilegeIndex(privilege);
  }, [patient]);

  useEffect(() => {
    const { gross = 0, discount = 0 } = computeGD(
      cart,
      categoryIndex,
      privilegeIndex
    );

    setGross(gross);
    setDiscount(discount);
  }, [cart, categoryIndex, privilegeIndex]);

  const toggleCheckout = () => setDidCheckout(!didCheckout);

  const handlePicker = (selected) =>
    setCart((prev) =>
      removeRedundantPackages(
        { ...selected, referenceId: selected._id, isNew: true },
        prev
      )
    );

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="fluid">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="cash-register" className="mr-2" />
        Point of Sale
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          {!didCheckout && (
            <CashierMenu
              handlePicker={handlePicker}
              categoryIndex={categoryIndex}
            />
          )}
          <CashierPatient
            setSourceVendor={setSourceVendor}
            gross={gross}
            discount={discount}
            cart={cart}
            setCart={setCart}
            categoryIndex={categoryIndex}
            patient={patient}
            setCategoryIndex={setCategoryIndex}
            privilegeIndex={privilegeIndex}
            setPrivilegeIndex={setPrivilegeIndex}
            setPhysicianId={setPhysicianId}
            didCheckout={didCheckout}
            toggleCheckout={toggleCheckout}
          />
          {didCheckout && (
            <CashierPayment
              patient={patient}
              cart={cart}
              privilegeIndex={privilegeIndex}
              sourceVendor={sourceVendor}
              toggleModal={toggle}
              physicianId={physicianId}
              categoryIndex={categoryIndex}
              gross={gross}
              discount={discount}
            />
          )}
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}

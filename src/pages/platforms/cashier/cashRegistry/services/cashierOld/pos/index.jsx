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
} from "../../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { Categories } from "../../../../../../../services/fakeDb";
import { SetMODAL } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";

export default function CashRegister() {
  const [didCheckout, setDidCheckout] = useState(false),
    [categoryIndex, setCategoryIndex] = useState(0),
    [privilegeIndex, setPrivilegeIndex] = useState(0),
    [gross, setGross] = useState(0),
    [discount, setDiscount] = useState(0),
    [cart, setCart] = useState([]),
    { message, isSuccess } = useSelector(({ sales }) => sales),
    { selected: deals, showModal: show } = useSelector(({ deals }) => deals),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      setDidCheckout(false);
    }
  }, [show]);
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
    const { category, privilege, soldCart = [] } = deals;
    if (!!soldCart.length) setCart(soldCart);

    if (category)
      setCategoryIndex(
        category === "walkin"
          ? 0
          : Categories.findIndex(({ abbr }) => abbr === category)
      );
    if (privilege) setPrivilegeIndex(privilege);
  }, [deals]);

  useEffect(() => {
    let totalGross = 0;
    let totalDiscount = 0;

    cart.forEach((menu) => {
      const { gross: compGross = 0, discount = 0 } = computeGD(
        menu,
        categoryIndex,
        privilegeIndex
      );
      totalGross += compGross;
      totalDiscount += discount;
    });

    setGross(totalGross);
    setDiscount(totalDiscount);
  }, [cart, categoryIndex, privilegeIndex]);

  const toggleCheckout = () => setDidCheckout(!didCheckout);

  const handlePicker = (selected) => {
    setCart((prev) =>
      removeRedundantPackages(
        { ...selected, referenceId: selected._id, isNew: true },
        prev
      )
    );
  };

  return (
    <MDBModal isOpen={show} toggle={SetMODAL} size="fluid">
      <MDBModalHeader
        toggle={() => dispatch(SetMODAL())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="cash-register" className="mr-2" />
        Point of Sales
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          {!didCheckout && (
            <CashierMenu handlePicker={handlePicker} cart={cart} />
          )}
          <CashierPatient
            gross={gross}
            discount={discount}
            cart={cart}
            setCart={setCart}
            categoryIndex={categoryIndex}
            patient={deals}
            setCategoryIndex={setCategoryIndex}
            privilegeIndex={privilegeIndex}
            setPrivilegeIndex={setPrivilegeIndex}
            didCheckout={didCheckout}
            toggleCheckout={toggleCheckout}
          />
          {didCheckout && (
            <CashierPayment
              Id
              deals={deals}
              cart={cart}
              toggleModal={SetMODAL}
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

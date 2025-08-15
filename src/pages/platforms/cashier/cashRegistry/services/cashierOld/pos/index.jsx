import { useState, useEffect } from "react";
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
import { Categories, Services } from "../../../../../../../services/fakeDb";
import { SetMODAL } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";

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
      totalDiscount += Number(discount || 0);
    });

    setGross(totalGross);
    setDiscount(totalDiscount);
  }, [cart, categoryIndex, privilegeIndex]);

  console.log("discount", discount);

  const toggleCheckout = () => setDidCheckout(!didCheckout);
  const handlePicker = (selected) => {
    const { packages } = selected;
    const { soldCart } = deals;

    const soldItemsInCart = [...cart].filter(({ referenceId }) =>
      soldCart.some(({ referenceId: sId }) => sId === referenceId)
    );

    const duplicateMenus = soldItemsInCart.filter(
      ({ packages: soldPackages, overrideBy = "" }) =>
        soldPackages.every((p) => packages.includes(p) && !overrideBy)
    );

    const department = Services.getDepartment(selected.packages) || [];

    const {
      cart: _cart,
      obj,
      stop = false, //if true we have a duplicate menu
    } = removeRedundantPackages(
      { ...selected, referenceId: selected._id, department, isNew: true },
      cart
    );
    if (stop) return;
    if (duplicateMenus.length > 0) {
      Swal.fire({
        title: "Duplicate Services Found",
        html: `
       <div style="text-align:left; font-size:14px; line-height:1.5;">
      
      <!-- Already Charged -->
      <h6 style="margin-bottom:8px; color:#d9534f;">Already Charged Menu(s)</h6>
      ${duplicateMenus
        .map((m) => {
          const chargedServices = Services.whereIn(m.packages);
          const chargedServiceNames = chargedServices
            .map((p) => `<span style="color:#d9534f;">${p.abbreviation}</span>`)
            .join(", ");

          return `
            <div style="margin-bottom:12px; padding:8px; border:1px solid #f0ad4e; border-radius:6px; background:#fff3cd;">
              <div><strong>Menu:</strong> ${
                m.description || m.abbreviation
              }</div>
              <div><strong>Services:</strong> ${chargedServiceNames}</div>
            </div>
          `;
        })
        .join("")}

      <!-- Newly Selected -->
      <h6 style="margin-bottom:8px; color:#5cb85c;">Newly Selected Menu</h6>
      <div style="padding:8px; border:1px solid #b2dfdb; border-radius:6px; background:#e0f2f1;">
        <div><strong>Menu:</strong> ${
          selected?.abbreviation || selected?.description
        }</div>
        <div><strong>Services:</strong> 
          ${Services.whereIn(selected.packages)
            .map((p) => {
              const isDuplicate = duplicateMenus.some((m) =>
                m.packages.includes(p.id)
              );
              return isDuplicate
                ? `<strong style="color:#d9534f;">${
                    p.description || p.abbreviation
                  }</strong>`
                : `<span>${p.description || p.abbreviation}</span>`;
            })
            .join(", ")}
        </div>
      </div>

      <hr style="margin:15px 0;">
      <p style="margin:0; font-size:13px;">
        <span style="color:#d9534f; font-weight:bold;">Red services</span> are already charged to this patient and also included in the new menu.<br>
        If you choose to <strong>override</strong>, these previously charged services will be removed and replaced by the new menu's services.
      </p>
    </div>
  `,
        showCancelButton: true, // For Cancel
        showDenyButton: true, // For middle option
        confirmButtonText: "Yes, override",
        denyButtonText: "Keep current charges",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33", // Red for danger
        denyButtonColor: "#3085d6", // Blue for keep
        cancelButtonColor: "#6c757d", // Gray for cancel
      }).then((result) => {
        if (result.isConfirmed) {
          const overrideCart = [..._cart];
          duplicateMenus.forEach((element) => {
            const index = _cart.findIndex(
              (item) => item.referenceId === element.referenceId
            );
            overrideCart[index] = {
              ...overrideCart[index],
              overrideBy: selected._id,
            };
          });
          setCart([...overrideCart, obj]);
        } else if (result.isDenied) {
          setCart([..._cart, obj]);
        }
      });
    } else {
      setCart([..._cart, obj]);
    }
  };

  const overrideCart = [...cart].filter(({ overrideBy = "" }) => overrideBy);
  const amountPaid = overrideCart.reduce((total, { up = 0 }) => up + total, 0);

  const overrideDiscount = overrideCart.reduce(
    (total, { discount = 0 }) => discount + total,
    0
  );

  return (
    <MDBModal isOpen={show} toggle={SetMODAL} size="xl">
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
            amountPaid={amountPaid}
            overrideDiscount={overrideDiscount}
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
              overrideCart={overrideCart}
              amountPaid={amountPaid}
              overrideDiscount={overrideDiscount}
              privilegeIndex={privilegeIndex}
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

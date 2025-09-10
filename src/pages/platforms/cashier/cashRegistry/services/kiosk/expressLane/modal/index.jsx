import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import {
  allServicesHavePrices,
  computeGD,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../../../services/utilities";
import { Categories, Services } from "../../../../../../../../services/fakeDb";
import { findIndex, isEmpty } from "lodash";
import {
  PROCESS_ONBOARDING,
  TOGGLE,
  RESET,
} from "../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import Swal from "sweetalert2";
import Customer from "./customer";
import Menus from "./menus";
import Summary from "./summary";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    {
      formSubmitted,
      isSuccess,
      showProcess: show,
      selected,
    } = useSelector(({ onBoardings }) => onBoardings),
    { collections: menus } = useSelector(({ menus }) => menus),
    [cart, setCart] = useState([]),
    [matchMenus, setMatchMenus] = useState([]),
    [cash, setCash] = useState(0),
    [payment, setPayment] = useState("cash"),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE(true)), [dispatch]);

  const {
    pid: customerId = {},
    client = {},
    branchId = {},
    privilege = 0,
    haveCard = false,
    membership = "",
    services: servicesId = [],
    contract,
  } = selected || {};

  // const { membership = "", servicesId = [], contract } = sendouts;

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, show, toggle, dispatch]);

  useEffect(() => {
    setCash(0);
    setPayment("cash");

    if (show && servicesId?.length > 0) {
      const defaultMenus = [];
      for (const menu of menus) {
        const { packages, isProfile = false } = menu;
        const isSubset =
          packages.length === 1 &&
          packages.every((id) => servicesId.includes(id));
        if (isSubset && !isProfile) {
          defaultMenus.push(menu);
          if (defaultMenus.length === servicesId.length) break;
        }
      }

      const _matchMenus = [...menus].filter(
        ({ packages, isProfile = false }) => {
          const isSubset =
            packages.length === 1 &&
            packages.every((id) => servicesId.includes(id));
          return isSubset && !isProfile;
        }
      );

      setMatchMenus(_matchMenus);
      setCart(defaultMenus);
    }
  }, [show, menus, servicesId]);

  const handleRemovedToCart = (_id) => {
    const _cart = [...cart];
    const index = findIndex(_cart, { _id });
    _cart.splice(index, 1);
    setCart(_cart);
  };

  const handleAddToCart = (menu) => {
    const { packages } = menu;
    const _cart = [...cart];
    const index = findIndex(_cart, { _id: menu._id });
    const duplicatePackages = _cart.some((item) =>
      menu.packages.some((id) => item.packages.includes(id))
    );

    if (duplicatePackages) {
      return Swal.fire({
        icon: "warning",
        title: "Duplicate Packages",
        html: `This    <b>${packages
          .map((id) => Services.getAbbr(id))
          .join(", ")}</b> package  has already been selected.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
    if (index > -1) return "";
    _cart.unshift(menu);
    setCart(_cart);
  };

  const getCategoryIndex = (c) => {
    return Categories.findIndex((item) => item.abbr === c);
  };

  const getCategory = () => {
    if (client?._id) return "ctr";
    return haveCard ? "wls" : "opd";
  };

  const getTotal = (cIndex, getObj = false) => {
    const { gross = 0, discount = 0 } = computeGD(
      cart,
      cIndex,
      privilege,
      membership,
      customerId?.healthCard?.name || "",
      contract
    );
    const amount = gross - discount;
    return !getObj ? amount : { gross, discount, amount };
  };

  const categoryIndex = getCategoryIndex(getCategory());
  const { discount, amount, gross } = getTotal(categoryIndex, true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const remainingPackages = [...servicesId].filter(
      (serviceID) => !cart.some((item) => item.packages.includes(serviceID))
    );

    const filteredCart = cart.filter(
      (item) => !item.packages.some((pkg) => remainingPackages.includes(pkg))
    );

    const dealMenus = filteredCart.map((cart) => {
      return {
        ...computeGD(
          cart,
          categoryIndex,
          -1,
          "",
          customerId?.healthCard?.name,
          contract
        ),
        menuId: cart._id,
      };
    });

    const deal = {
      source: branchId?._id,
      branchId: activePlatform.branchId,
      customerId: customerId._id,
      cash,
      category: getCategory(),
      cashierId: auth._id,
      payment: getCategory() === "opd" ? payment : "voucher",
      department: Services.getDepartment(
        filteredCart.flatMap(({ packages }) => packages)
      ),
      discount,
      amount: gross,
    };

    const data = {
      deal,
      dealMenus,
      onboardingID: selected?._id,
      empId: auth._id,
      status: "done",
    };

    if (!isEmpty(remainingPackages)) {
      return Swal.fire({
        icon: "warning",
        title: "Partial Acknowledgement",
        html: `
      <div style="text-align: left; font-size: 15px;">
        <p>The request from <b>${
          getCategory() === "ctr"
            ? client.displayname
            : fullName(customerId?.fullName)
        }</b> has been
          <span style="color: #e67e22;"><b>partially acknowledged</b></span>.
        </p>
        <p>The following services could not be accommodated:</p>
        <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 1em;">
          ${remainingPackages
            .map((id) => `<li>${Services.getAbbr(id)}</li>`)
            .join("")}
        </ul>
        <p style="margin-top: 1em;"><i>Please provide your reason for the incomplete processing:</i></p>
      </div>`,
        input: "textarea",
        inputPlaceholder: "Enter your remarks here...",
        inputAttributes: {
          "aria-label": "Remarks",
        },
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        preConfirm: (remarks) => {
          if (!remarks) {
            Swal.showValidationMessage("Please provide a remarks.");
          }
          return remarks;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const remarks = result.value;
          dispatch(
            PROCESS_ONBOARDING({
              data: {
                ...data,
                remarks,
                cancelled: remainingPackages,
              },
              token,
            })
          );
        }
      });
    }

    if (
      !allServicesHavePrices(
        cart,
        categoryIndex,
        customerId?.healthCard?.name,
        contract
      )
    ) {
      Swal.fire({
        title: "Service Validator?",
        text: "Some services do not have a set price. Please double-check. If you're confident everything is correct, you may proceed. Note that the admin will be notified regarding this issue.",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(PROCESS_ONBOARDING({ data, token }));
        }
      });
    } else {
      return dispatch(PROCESS_ONBOARDING({ data, token }));
    }
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="fluid">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {fullName(customerId.fullName)} | {getAge(customerId.dob)}
        <br />
        <small
          style={{
            marginBottom: "-15px",
            marginTop: "-4px",
            display: "block",
            fontWeight: "300",
            marginLeft: "2rem",
            fontSize: "1rem",
          }}
        >
          {fullAddress(customerId.address)}
        </small>
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <Customer deal={selected} categoryIndex={categoryIndex} />
          <Menus
            cart={cart}
            selected={selected}
            category={categoryIndex}
            contract={contract}
            // discount={discountPercentage}
            matchMenus={matchMenus}
            handleAddToCart={handleAddToCart}
            handleRemovedToCart={handleRemovedToCart}
          />
          <Summary
            cart={cart}
            gross={gross}
            discount={discount}
            amount={amount}
            handleSubmit={handleSubmit}
            formSubmitted={formSubmitted}
            selected={selected}
            cash={cash}
            setCash={setCash}
            payment={payment}
            setPayment={setPayment}
            category={getCategory()}
          />
        </MDBRow>
      </MDBModalBody>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // background: "#f1c40f",
          padding: ".5rem",
          borderRadius: ".5rem",
          margin: ".5rem 0",
          color: "#f1c40f",
        }}
      >
        Autogenerated POS by
        <span style={{ color: "#2c3e50", marginLeft: "10px" }}> Pinoy iMD</span>
      </div>
    </MDBModal>
  );
}

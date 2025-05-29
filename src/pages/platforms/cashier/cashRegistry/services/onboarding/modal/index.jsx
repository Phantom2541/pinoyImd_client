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
  computeGD,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../../services/utilities";
import { Categories, Services } from "../../../../../../../services/fakeDb";
import { findIndex, isEmpty } from "lodash";
import {
  PROCESS_ONBOARDING,
  SetMODAL,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import Swal from "sweetalert2";
import Customer from "./customer";
import Menus from "./menus";
import Summary from "./summary";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    {
      formSubmitted,
      isSuccess,
      showModal: show,
      selected,
    } = useSelector(({ deals }) => deals),
    { collections: menus } = useSelector(({ menus }) => menus),
    [cart, setCart] = useState([]),
    [matchMenus, setMatchMenus] = useState([]),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(SetMODAL(false)), [dispatch]);

  const {
    customerId = {},
    sendouts = {},
    branchId = {},
    privilege = 0,
    category,
  } = selected || {};

  const { membership = "", servicesId = [] } = sendouts;

  // const discountPercentage =
  //   Memberships.find(({ value }) => value === membership)?.discount || 0;

  // const discount = discountPercentage
  //   ? [...cart]
  //       .filter(({ discountable }) => discountable)
  //       .reduce((acc, { opd }) => (acc += opd * discountPercentage || 0), 0)
  //   : 0;

  // const gross = [...cart].reduce((acc, curr) => (acc += curr?.opd || 0), 0);

  useEffect(() => {
    if (show && !formSubmitted && isSuccess) {
      toggle();
    }
  }, [formSubmitted, isSuccess, show, toggle]);

  useEffect(() => {
    if (show) {
      const defaultMenus = [];
      for (const menu of menus) {
        const { packages, isProfile = false } = menu;
        const isSubset =
          packages.length > 0 &&
          packages.every((id) => servicesId.includes(id));
        if (isSubset && !isProfile) {
          defaultMenus.push(menu);
          if (defaultMenus.length === servicesId.length) break;
        }
      }

      const _matchMenus = [...menus].filter(
        ({ packages, isProfile = false }) => {
          const isSubset =
            packages.length > 0 &&
            packages.every((id) => servicesId.includes(id));
          return isSubset && !isProfile;
        }
      );
      setMatchMenus(_matchMenus);
      setCart(defaultMenus);
    }
  }, [show, servicesId, menus]);

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

  const isApplySourceDisc =
    (category === "opd" || category === "wi") && !privilege;

  const baseCategory = isApplySourceDisc ? "is" : category;
  const categoryIndex = Categories.findIndex(
    (item) => item.abbr === baseCategory
  );

  const { gross = 0, discount = 0 } = computeGD(
      cart,
      categoryIndex,
      privilege,
      membership
    ),
    amount = gross - discount;

  const handleSubmit = () => {
    const remainingPackages = [...servicesId].filter(
      (serviceID) => !cart.some((item) => item.packages.includes(serviceID))
    );

    const updateDeal = {
      _id: selected?._id,
      acknowledge: {
        by: auth._id,
        at: new Date(),
        status: true,
      },
    };

    const dealMenus = [...cart].map(({ _id, opd }) => ({
      menuId: _id,
      up: opd,
      discount: discount ? discount : 0,
    }));

    const deal = {
      source: branchId?._id,
      branchId: activePlatform.branchId,
      customerId: customerId._id,
      cash: 0,
      category: "opd",
      cashierId: auth._id,
      payment: "voucher",
      discount,
      amount: gross,
    };

    const data = {
      deal,
      dealMenus,
      updateDeal,
    };

    if (!isEmpty(remainingPackages)) {
      return Swal.fire({
        icon: "warning",
        title: "Partial Acknowledgement",
        html: `
      <div style="text-align: left; font-size: 15px;">
        <p>The request from <b>${branchId.displayname}</b> has been 
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
            Swal.showValidationMessage("Please provide a remark.");
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
                updateDeal: {
                  ...updateDeal,
                  remarks,
                  status: false,
                },
              },
              token,
            })
          );
        }
      });
    } else {
      dispatch(PROCESS_ONBOARDING({ data, token }));
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
          <Customer deal={selected} />
          <Menus
            cart={cart}
            selected={selected}
            category={categoryIndex}
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
          />
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}

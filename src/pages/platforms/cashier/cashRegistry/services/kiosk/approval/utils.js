import Swal from "sweetalert2";
import {
  allServicesHavePrices,
  computeGD,
} from "../../../../../../../services/utilities";

const getServices = (cart) => {
  return cart.flatMap(({ packages }) => packages);
};
const getGross = (cart, selected) => {
  const { requirements, haveCard = false } = selected;
  const { gross = 0 } = computeGD(cart, 0, 0, {
    type: haveCard ? "wls" : "",
    company: { name: requirements?.hmo || "" },
  });
  return gross;
};
const utils = {
  compute: {
    charges: (cart, selected) => {
      const { requirements, haveCard = false } = selected;
      const { gross = 0, discount = 0 } = computeGD(cart, 0, 0, {
        type: haveCard ? "wls" : "opd",
        company: { name: requirements?.hmo },
      });
      const amount = gross - discount;
      return { gross, discount, amount };
    },
    cashOut: (cart, selected) => {
      const { requirements } = selected;
      const _cart = [...cart].filter(({ isApproved = true }) => !isApproved);
      const { gross = 0 } = computeGD(_cart, 0, 0, {
        type: "wls",
        company: { name: requirements?.hmo },
      });
      return gross;
    },
  },
  refNo: {
    process: (cart, refNo, selected) => {
      const {
        haveCard = false,
        requirements,
        isWalkin = false,
        pid = {},
      } = selected;
      const { healthCard = {} } = pid;
      const _refNo = { ...refNo };

      if (!haveCard) {
        const { careOf, ...rest } = _refNo;
        return {
          ...rest,
          amount: getGross(cart, selected),
          ...(_refNo.pp === "co" && { careOf }),
        };
      }
      if (haveCard) {
        const { careOf, ...rest } = _refNo;
        const covered = cart.filter(({ isApproved = true }) => isApproved);
        const notCovered = cart.filter(({ isApproved = true }) => !isApproved);
        const coveredAmount = getGross(covered, selected);
        const notCoveredAmount = getGross(notCovered, selected);
        return {
          ...rest,
          number: isWalkin ? requirements.cardId : healthCard.id,
          amount: coveredAmount,
          ...(_refNo.pp === "co" && {
            careOf: { ..._refNo.careOf, amount: notCoveredAmount },
          }),
        };
      }
    },
  },
  refNoIsValid: (refNo) => {
    const { pp, careOf } = refNo;
    if (pp === "co" && !careOf.user) {
      const category = {
        bm: "Board Member",
        employee: "Employee",
        physician: "Physician",
      };
      Swal.fire({
        icon: "warning",
        title: `${category[careOf.category]} Required`,
        text: `Please select a ${
          category[careOf.category]
        } who will take care of this credit transaction.`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
        backdrop: true,
      });
      return false;
    }
    return true;
  },

  checkOutChecker: (cart, selected, payment) => {
    const { haveCard = false } = selected;
    const notCovered = cart.filter(({ isApproved = true }) => !isApproved);
    const amount = getGross(notCovered, selected);
    if (amount > 0 && haveCard && payment === "voucher") {
      Swal.fire({
        title: "<strong>Notice ⚠️</strong>",
        html: `
        Some items in your cart are <strong>not covered by the HMO</strong>.<br><br>
        To continue, you will need to either:<br>
        • Pay the uncovered balance (<strong>cash-out</strong>)<br>
        • Use <strong>split billing</strong> and assign who will cover the cost<br>
        • Or remove the uncovered items from your cart.<br><br>
        Please update your selection before proceeding.
      `,
        icon: "warning",
        confirmButtonText: "OK",
      });

      return false;
    }
    return true;
  },
  priceChecker: (cart, selected, isSendOut) => {
    const { requirements, haveCard = false } = selected;
    if (
      !allServicesHavePrices(cart, 0, {
        type: haveCard ? "wls" : "wi",
        company: { name: requirements?.hmo },
      }) &&
      !isSendOut
    ) {
      Swal.fire({
        title: "Service Validator ⚠️",
        html: `
    Some menu items <strong style="color:#d33;">do not have a set price</strong>.<br><br>
    Please <strong>contact the admin</strong> first to assign a price for these items 
    so the <strong>voucher computation</strong> will be accurate before you proceed.<br><br>
    Or you may simply <strong style="color:#d33;">remove the selected menu items</strong> 
    that have no price set.
  `,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK, I Understand",
      });

      return false;
    }
    return true;
  },
  arrangeServices: (cart, selected) => {
    const { haveCard = false } = selected;
    //return all services
    if (!haveCard) return { covered: getServices(cart) };
    //Seperate approved and unapproved items in cart
    const covered = cart.filter(({ isApproved = true }) => isApproved);
    const notCovered = cart.filter(({ isApproved = true }) => !isApproved);

    return {
      covered: getServices(covered),
      notCovered: getServices(notCovered),
    };
  },
};

export default utils;

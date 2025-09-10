import { computeGD } from "../../../../../../../services/utilities";

const getServices = (cart) => {
  return cart.flatMap(({ packages }) => packages);
};
const getGross = (cart, requirements) => {
  const { gross = 0 } = computeGD(cart, 0, 0, {
    type: "wls",
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
          amount: getGross(cart, requirements),
          ...(_refNo.pp === "co" && { careOf }),
        };
      }
      if (haveCard) {
        const { careOf, ...rest } = _refNo;
        const covered = cart.filter(({ isApproved = true }) => isApproved);
        const notCovered = cart.filter(({ isApproved = true }) => !isApproved);
        const coveredAmount = getGross(covered, requirements);
        const notCoveredAmount = getGross(notCovered, requirements);
        return {
          ...rest,
          number: isWalkin ? requirements.cardId : healthCard.id,
          amount: coveredAmount,
          ...(_refNo.pp === "co" && {
            careOf: { ..._refNo.careOf, amount: notCoveredAmount },
          }),
        };
      }
      // ref;
      // return _refNo;
    },
  },
  arrangeServices: (cart, selected) => {
    const { haveCard = false } = selected;
    //return all services
    if (!haveCard) return getServices(cart);
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

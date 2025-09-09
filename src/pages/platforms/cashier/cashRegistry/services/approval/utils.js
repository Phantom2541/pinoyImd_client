import { computeGD } from "../../../../../../services/utilities";

const utils = {
  compute: {
    charges: (cart, selected) => {
      const { requirements, haveCard = false } = selected;
      const { gross = 0, discount = 0 } = computeGD(cart, "wi", -1, {
        type: haveCard ? "wls" : "opd",
        company: { name: requirements?.hmo },
      });
      const amount = gross - discount;
      return { gross, discount, amount };
    },
    cashOut: (cart, selected) => {
      const { requirements } = selected;
      const _cart = [...cart].filter((item) => !item.isApproved);
      const { gross = 0 } = computeGD(_cart, "wi", -1, {
        type: "wls",
        company: { name: requirements?.hmo },
      });
      return gross;
    },
  },
  computeCharges: (cart, selected) => {
    const { requirements, haveCard = false } = selected;
    const { gross = 0, discount = 0 } = computeGD(cart, "wi", -1, {
      type: haveCard ? "wls" : "opd",
      company: { name: requirements?.hmo },
    });
    const amount = gross - discount;
    return { gross, discount, amount };
  },
};

export default utils;

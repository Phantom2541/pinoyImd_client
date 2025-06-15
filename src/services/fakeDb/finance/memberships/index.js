import collections from "./collections.json";
const Memberships = {
  collections,
  getEmoji: (membership) => {
    return collections.find(({ value }) => value === membership)?.emoji;
  },
  getDiscount: (membership) => {
    return collections.find(({ value }) => value === membership)?.discount;
  },

  getMembership: (membership) => {
    return collections.find(({ value }) => value === membership)?.text;
  },
  getDiscountedSRP: (membership, menu) => {
    const { discountable = false, opd } = menu;
    const discount =
      opd * collections.find(({ value }) => value === membership)?.discount ||
      0;

    return discountable ? opd - discount : opd;
  },
};

export default Memberships;

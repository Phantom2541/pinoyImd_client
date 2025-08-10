import { fullName } from "../../../../../services/utilities";

const util = {
  getVendorOrParticular: (particular, supplier) => {
    if (!particular && !supplier) return "-";
    const { vendors = {} } = supplier || {};
    return particular?._id
      ? fullName(particular.fullName)
      : vendors?._id
      ? `${vendors?.name || vendors?.displayname} `
      : `${supplier?.name || supplier?.displayname}`;
  },
};

export default util;

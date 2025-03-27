import { fullName } from "../../../../../services/utilities";

const util = {
  getVendorOrParticular: (particular, supplier) => {
    const { vendors = {} } = supplier || {};
    return particular?._id
      ? fullName(particular.fullName)
      : vendors?._id
      ? `${vendors?.name} - ${vendors?.subname}`
      : `${supplier?.name}${`${
          supplier?.subname ? ` - ${supplier.subname}` : ""
        }`}`;
  },
};

export default util;

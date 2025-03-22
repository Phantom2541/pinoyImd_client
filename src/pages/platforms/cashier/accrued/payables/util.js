import { fullName } from "../../../../../services/utilities";

const util = {
  getVendorOrParticular: (particular, supplier) => {
    const { vendors = {} } = supplier || {};
    console.log("particular", vendors?._id);
    return particular?._id
      ? fullName(particular)
      : vendors?._id
      ? `${vendors?.name} - ${vendors?.subname}`
      : `${supplier?.name}${`${
          supplier?.subname ? ` - ${supplier.subname}` : ""
        }`}`;
  },
};

export default util;

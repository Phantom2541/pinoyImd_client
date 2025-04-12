import { fullName } from "../../../../../services/utilities";

const util = {
  getVendorOrParticular: (particular, supplier) => {
    const { vendors = {} } = supplier || {};
    return particular?._id
      ? fullName(particular.fullName)
      : vendors?._id
      ? `${vendors?.name} - ${vendors?.subname}`
      : `${supplier?.displayname || supplier?.name}`;
  },
};

export default util;

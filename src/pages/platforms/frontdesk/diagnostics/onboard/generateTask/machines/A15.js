import { Templates } from "../../../../../../../services/fakeDb";
import { axiosMiddleware } from "../../../../../../../services/utilities";

const A15 = async (testObj, section, deal) => {
  const { pn, customerId = {} } = deal;
  const { fullName = {} } = customerId;
  const tests = Object.keys(testObj)?.map(
    (id) =>
      `N SER ${Templates.getAbbr(section)}-${pn} ${id} T15 ${fullName?.lname},${
        fullName?.fname
      }`
  );
  if (tests.length === 0) return `No test found for ${section}`;
  await axiosMiddleware.sendToA15(tests);
};

export default A15;

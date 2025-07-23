import { axiosMiddleware } from "../../../../../../services/utilities";

const A15 = async (services, pi) => {
  const tests = services?.map((id) => `N SER ${pi} ${id} T15`);
  if (tests.length === 0) return `No test found for`;
  await axiosMiddleware.sendToA15(tests);
};

export default A15;

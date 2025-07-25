import { axiosMiddleware } from "../../../../../../services/utilities";
import { BROWSE } from "../../../../../../services/indexDB/commerce/market/machines";
const A15 = async (workID, services, pi) => {
  const dbServices = await BROWSE("688192d65e0037604f4fd35e");
  const tests = services
    ?.map((id) => {
      const code = dbServices.find((s) => Number(s.id) === Number(id))?.code;
      return code ? `N SER ${pi} ${code} T15 ${id}` : "";
    })
    .filter(Boolean);
  if (tests.length === 0) return `No test found for`;
  await axiosMiddleware.sendToA15({ tests, pi, _id: workID });
};

export default A15;

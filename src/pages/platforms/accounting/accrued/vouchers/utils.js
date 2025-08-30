import { HMO } from "../../../../../services/fakeDb";
import { dateFormat } from "../../../../../services/utilities";

const get = {
  menus: (cluster) => {
    return [
      ...new Map(
        cluster
          .flatMap(({ deals }) =>
            deals.flatMap(({ cart }) =>
              cart
                .filter(({ menuId }) => menuId?.isProfile)
                .map(({ menuId }) => ({
                  _id: menuId._id,
                  abbr: menuId.abbreviation,
                  packages: menuId.packages,
                }))
            )
          )
          .map((menu) => [menu._id, menu]) // Ensure uniqueness by _id
      ).values(),
    ];
  },
  dateRange: ({ vendor, cluster, isSource = true }) => {
    const { cutoff } = vendor; // cutoff is a number (day)
    const deals = cluster.flatMap(({ deals }) => deals);

    if (isSource) {
      const now = new Date();
      const endDate = new Date(now.getFullYear(), now.getMonth(), cutoff);

      // Calculate startDate: subtract 1 month from endDate, then add 1 day
      let startDate = new Date(endDate); // clone endDate to avoid mutation
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(startDate.getDate() + 1);

      // Find earliest createdAt in deals that is less than startDate
      const earlierCreatedAtDates = deals
        .map((deal) => new Date(deal.createdAt))
        .filter((date) => date < startDate);

      if (earlierCreatedAtDates.length > 0) {
        // Find the minimum (earliest) date from filtered dates
        const earliestCreatedAt = new Date(Math.min(...earlierCreatedAtDates));
        startDate = earliestCreatedAt;
      }
      return `${dateFormat(startDate)} - ${dateFormat(endDate)}`;
    } else {
      const dates = cluster.map((deal) => new Date(deal.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      return `${dateFormat(minDate)} - ${dateFormat(maxDate)}`;
    }
  },
  fileName: ({ vendor, cluster, isSource = true, hmo }) => {
    if (isSource) {
      const { companyId = { name: "" }, name, subname } = vendor;
      const { name: companyName = "" } = companyId || {};
      return `${companyName ? companyName : ""} ${`${
        subname || name
      }`},${get.dateRange({ vendor, cluster, isSource })}`;
    } else {
      return `${HMO.getName(hmo)},${get.dateRange({
        vendor,
        cluster,
        isSource,
      })}`;
    }
  },
  name: (vendor) => {
    const { companyId = {}, name, subname } = vendor;
    const { name: companyName = "" } = companyId || {};
    return `${companyName ? companyName : ""} ${`${subname || name}`}`;
  },
  due: (vendor) => {
    const { due = 0 } = vendor;
    if (!due) return "-";
    const now = new Date();
    return dateFormat(new Date(now.getFullYear(), now.getMonth(), due));
  },
};

export default get;

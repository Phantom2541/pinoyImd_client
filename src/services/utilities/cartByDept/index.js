import { Services } from "../../fakeDb";
import getDepartment from "../getDepartment";

/**
 * Filter the cart by department
 * @param {Array} cart - The cart data
 * @param {String} department - The department to filter by
 * @returns {Array} A new array with the filtered data
 */
const cartByDept = (cart, department) => {
  if (!cart?.length) return [];
  return [...cart]
    ?.map(({ packages, ...rest }) => {
      const packagesFormatted = Services.filterByDepartment(
        packages,
        getDepartment(department)
      );
      return { packages: packagesFormatted || [], ...rest };
    })
    .filter(({ packages }) => packages?.length > 0);
};

export default cartByDept;

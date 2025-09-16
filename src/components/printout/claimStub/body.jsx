import { MDBTable } from "mdbreact";
import { Services } from "../../../services/fakeDb";
import { currency } from "../../../services/utilities";
const Body = ({ cart }) => {
  return (
    <MDBTable responsive borderless className="mb-0 thermal-font">
      <thead>
        <tr>
          <th colSpan={2} className="py-0" style={{ fontSize: "17.5px" }}>
            Services
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(cart) &&
          cart?.map((menu, index) => {
            const {
              description,
              abbreviation,
              packages = [],
              up,
              discount = 0,
            } = menu;

            return (
              <tr key={`menu-${index}`}>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-left py-0 px-0 text-uppercase"
                >
                  {description || abbreviation}
                  {Array.isArray(packages) &&
                    packages.length > 1 &&
                    packages.map((id, pIndex) => {
                      const service = Services?.find?.(id);
                      if (!service) return null;

                      const { name, abbreviation } = service;
                      return (
                        <div
                          key={`package-${pIndex}`}
                          className="ml-4 stub-item"
                        >
                          -{abbreviation || name}
                        </div>
                      );
                    })}
                </td>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-right py-0 px-0"
                >
                  {currency.format(up + discount)}
                </td>
              </tr>
            );
          })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

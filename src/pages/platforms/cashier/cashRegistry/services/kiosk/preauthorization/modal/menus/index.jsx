import { MDBCol, MDBBadge, MDBIcon } from "mdbreact";
import { SearchMenu } from "../../../../../../../../../components/searchables";
import { Services } from "../../../../../../../../../services/fakeDb";
import {
  computeGD,
  currency,
} from "../../../../../../../../../services/utilities";
const Menus = ({
  selected,
  cart,
  category, //category index
  contract,
  matchMenus,
  handleAddToCart,
  handleRemovedToCart,
}) => {
  const { sendouts = {}, privilege, pid = {} } = selected || {};
  const { membership = "" } = sendouts;
  return (
    <MDBCol md="4">
      <table className="menus-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center ">
                <SearchMenu
                  filtered={matchMenus}
                  setMenu={handleAddToCart}
                  // setRegister={setRegister}
                />
              </div>
            </th>
          </tr>
          <tr>
            <th className="text-left">Menus</th>
            <th style={{ width: "75px" }}>UP</th>
            <th style={{ width: "75px" }}>SRP</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            const { _id, description, abbreviation, packages } = item;
            const {
              gross = 0,
              up = 0,
              title = "",
              color = "",
            } = computeGD(
              item,
              category,
              privilege,
              membership,
              pid?.healthCard?.name || "",
              contract
            );
            return (
              <tr key={_id}>
                <td className="text-left" title={title}>
                  <span>
                    {description ? `${description} - ` : ""}
                    {abbreviation}
                  </span>
                  <small className="d-block">
                    {/* Check if there are no packages */}
                    {(!packages || packages.length === 0) && (
                      <MDBBadge color="danger" className="mr-1">
                        No tag services.
                      </MDBBadge>
                    )}
                    {/* If there are packages, map over them and display their abbreviations */}
                    {packages &&
                      packages.length > 0 &&
                      packages.map((id) => (
                        <MDBBadge key={id} color="primary" className="mr-1">
                          {Services.getAbbr(id)}
                        </MDBBadge>
                      ))}
                  </small>
                </td>
                <td
                  title="Suggested Retail Price"
                  // className={discountable && "text-primary"}
                >
                  {currency.format(gross)}
                </td>
                <td title="Suggested Retail Price">
                  <span className={`text-${color}`}>{currency.format(up)}</span>
                  <button
                    onClick={() => handleRemovedToCart(_id)}
                    className="menus-button-delete"
                  >
                    <MDBIcon icon="trash" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </MDBCol>
  );
};

export default Menus;

import { useDispatch, useSelector } from "react-redux";
import { SearchMenu } from "../../../../../../../components/searchables";
import { MDBIcon, MDBBadge } from "mdbreact";
import {
  computeGD,
  currency,
} from "../../../../../../../services/utilities/index.js";
import { Services } from "../../../../../../../services/fakeDb/index.js";
import {
  ADDTOCART,
  REMOVEFROMCART,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos.js";

export default function Menus({ patronPresent }) {
  const { category, privilege, cart, membership, hmo, contract } = useSelector(
      ({ pos }) => pos
    ),
    dispatch = useDispatch();

  const handleADDtoCart = (item) => dispatch(ADDTOCART(item));
  const handleRemovedToCart = (_id) => dispatch(REMOVEFROMCART(_id));

  return (
    <>
      <div className="menus-table-container">
        <SearchMenu setMenu={handleADDtoCart} />
        <table className="menus-table">
          <thead>
            <tr>
              <th className="text-left">Services</th>
              <th style={{ width: "75px" }}>SRP</th>
              <th style={{ width: "75px" }}>UP</th>
            </tr>
          </thead>
          <tbody>
            {!cart.length && (
              <tr>
                <td colSpan="3" className="menus-empty">
                  <span>
                    Start by{" "}
                    {patronPresent
                      ? "searching your menus"
                      : "selecting a client"}
                    .
                  </span>
                </td>
              </tr>
            )}
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
                hmo,
                contract
              );

              return (
                <tr key={_id}>
                  <td className="text-left">
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
                  <td title="Suggested Retail Price">
                    {currency.format(gross)}
                  </td>
                  <td title={title}>
                    <span className={`text-${color} menus-up`}>
                      {currency.format(up)}
                    </span>
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
      </div>
    </>
  );
}

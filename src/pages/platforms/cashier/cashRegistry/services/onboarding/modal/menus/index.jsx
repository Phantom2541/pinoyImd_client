import React from "react";
import { MDBCol, MDBBadge, MDBIcon } from "mdbreact";
import { SearchMenu } from "../../../../../../../../components/searchables";
import { Services } from "../../../../../../../../services/fakeDb";
import { currency } from "../../../../../../../../services/utilities";
const Menus = ({
  cart,
  matchMenus,
  handleAddToCart,
  handleRemovedToCart,
  discount,
}) => {
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
            const {
              _id,
              description,
              abbreviation,
              packages,
              opd,
              discountable,
            } = item;
            const discounted = discountable ? opd - opd * discount : opd;
            return (
              <tr key={_id}>
                <td
                  className="text-left"
                  title={discountable ? "Discountable" : "Not Discountable"}
                >
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
                  className={discountable && "text-primary"}
                >
                  {currency(opd)}
                </td>
                <td title="Suggested Retail Price">
                  <span>{currency(discounted)}</span>
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

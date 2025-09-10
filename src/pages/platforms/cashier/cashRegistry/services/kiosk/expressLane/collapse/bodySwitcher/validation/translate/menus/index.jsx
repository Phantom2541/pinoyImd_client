import { MDBCol, MDBBadge, MDBIcon } from "mdbreact";
import { SearchMenu } from "../../../../../../../../../../../../components/searchables";
import { Services } from "../../../../../../../../../../../../services/fakeDb";

import "./style.css";
const Menus = ({ cart, matchMenus, handleAddToCart, handleRemovedToCart }) => {
  return (
    <MDBCol md="6">
      <table className="menus-translate-table">
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
          </tr>
        </thead>
        <tbody>
          {!cart.length && (
            <tr>
              <td colSpan="3" className="menus-translate-empty">
                <span>Start by searching your menus .</span>
              </td>
            </tr>
          )}
          {cart.map((item) => {
            const { _id, description, abbreviation, packages } = item;

            return (
              <tr key={_id}>
                <td className="text-left position-relative">
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
                  <button
                    onClick={() => handleRemovedToCart(_id)}
                    className="menus-translate-button-delete"
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

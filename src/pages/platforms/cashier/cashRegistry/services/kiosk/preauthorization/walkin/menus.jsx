import { MDBCol, MDBBadge, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../../../services/fakeDb";
import { SearchMenu } from "../../../../../../../../components/searchables";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { findIndex } from "lodash";

const Menus = ({ setForm = () => {} }) => {
  const { collections: menus } = useSelector(({ menus }) => menus);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, cart }));
  }, [cart]);
  const handleRemovedToCart = (_id) => {
    const _cart = [...cart];
    const index = findIndex(_cart, { _id });
    _cart.splice(index, 1);
    setCart(_cart);
  };

  const handleAddToCart = (menu) => {
    const { packages } = menu;
    const _cart = [...cart];
    const index = findIndex(_cart, { _id: menu._id });
    const duplicatePackages = _cart.some((item) =>
      menu.packages.some((id) => item.packages.includes(id))
    );

    if (duplicatePackages) {
      return Swal.fire({
        icon: "warning",
        title: "Duplicate Packages",
        html: `This    <b>${packages
          .map((id) => Services.getAbbr(id))
          .join(", ")}</b> package  has already been selected.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
    }
    if (index > -1) return "";
    _cart.unshift(menu);
    setCart(_cart);
  };

  return (
    <MDBCol md="6">
      <table className="menus-translate-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center ">
                <SearchMenu
                  filtered={menus.filter(
                    ({ isProfile, packages }) =>
                      !isProfile && packages.length === 1
                  )}
                  setMenu={handleAddToCart}
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

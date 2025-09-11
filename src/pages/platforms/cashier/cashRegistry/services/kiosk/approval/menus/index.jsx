import { MDBCol, MDBBadge, MDBIcon } from "mdbreact";
import { SearchMenu } from "../../../../../../../../components/searchables";
import { Services } from "../../../../../../../../services/fakeDb";
import {
  computeGD,
  currency,
} from "../../../../../../../../services/utilities";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  RemoveCART,
  SetCHECK,
  SetCART,
} from "../../../../../../../../services/redux/slices/commerce/pos/services/kiosk";
import { findIndex } from "lodash";
import Swal from "sweetalert2";
const Menus = ({ category }) => {
  const {
    selected,
    cart,
    menus,
    isSendOut = false,
  } = useSelector(({ kiosk }) => kiosk);
  const {
    privilege,
    haveCard = false,
    requirements,
    isWalkin = false,
    contract,
  } = selected || {};
  const dispatch = useDispatch();

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
    dispatch(SetCART(_cart));
  };
  return (
    <MDBCol md={!isWalkin ? "4" : "7"}>
      <table className="menus-onboarding-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center ">
                <SearchMenu
                  filtered={menus}
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
          {!cart.length && (
            <tr>
              <td colSpan="3" className="menus-empty">
                <span>Start by searching your menus .</span>
              </td>
            </tr>
          )}
          {cart.map((item) => {
            const {
              _id,
              description,
              abbreviation,
              packages,
              isApproved = true,
            } = item;
            const {
              gross = 0,
              up = 0,
              title = "",
              color = "",
            } = computeGD(item, 0, privilege, {
              type: haveCard ? "wls" : isSendOut ? "ctr" : "opd",
              company: {
                name: requirements?.hmo,
              },
              ...(isSendOut && { tier: contract }),
            });

            return (
              <tr key={_id}>
                <td
                  className="text-left"
                  title={title}
                  style={{ background: "white !important" }}
                >
                  <div>
                    {haveCard && (
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isApproved}
                        id={`approved-${_id}`}
                        onChange={() => dispatch(SetCHECK(_id))}
                      />
                    )}
                    <label
                      htmlFor={`approved-${_id}`}
                      className="form-check-label label-table"
                    >
                      <div>
                        <span>
                          {description ? `${description} - ` : ""}
                          {abbreviation}
                        </span>
                        <small className="d-block mt-n1">
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
                              <MDBBadge
                                key={id}
                                color="primary"
                                className="mr-1"
                              >
                                {Services.getAbbr(id)}
                              </MDBBadge>
                            ))}
                        </small>
                      </div>
                    </label>
                  </div>
                </td>
                <td title="Suggested Retail Price">{currency.format(gross)}</td>
                <td title="Suggested Retail Price">
                  <span className={`text-${color} menus-up`}>
                    {currency.format(up)}
                  </span>
                  <button
                    onClick={() => dispatch(RemoveCART(_id))}
                    className="menus-onboarding-button-delete"
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

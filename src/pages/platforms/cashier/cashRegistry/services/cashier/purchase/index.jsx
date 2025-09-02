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
  OVERRIDE_CART,
  REMOVEFROMCART,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos.js";
import Swal from "sweetalert2";

export default function Menus({ patronPresent }) {
  const { category, privilege, cart, membership, hmo, contract } = useSelector(
      ({ pos }) => pos
    ),
    { customer } = useSelector(({ pos }) => pos),
    dispatch = useDispatch();

  const duplicateMenusChecker = (duplicateMenus, selected) => {
    Swal.fire({
      title: "Duplicate Services Found",
      html: `
             <div style="text-align:left; font-size:14px; line-height:1.5;">
            
            <!-- Already Charged -->
            <h6 style="margin-bottom:8px; color:#d9534f;">Already Selected Menu(s)</h6>
            ${duplicateMenus
              .map((m) => {
                const chargedServices = Services.whereIn(m.packages);
                const chargedServiceNames = chargedServices
                  .map(
                    (p) =>
                      `<span style="color:#d9534f;">${p.abbreviation}</span>`
                  )
                  .join(", ");

                return `
                  <div style="margin-bottom:12px; padding:8px; border:1px solid #f0ad4e; border-radius:6px; background:#fff3cd;">
                    <div><strong>Menu:</strong> ${
                      m.description || m.abbreviation
                    }</div>
                    <div><strong>Services:</strong> ${chargedServiceNames}</div>
                  </div>
                `;
              })
              .join("")}
      
            <!-- Newly Selected -->
            <h6 style="margin-bottom:8px; color:#5cb85c;">Newly Selected Menu</h6>
            <div style="padding:8px; border:1px solid #b2dfdb; border-radius:6px; background:#e0f2f1;">
              <div><strong>Menu:</strong> ${
                selected?.abbreviation || selected?.description
              }</div>
              <div><strong>Services:</strong> 
                ${Services.whereIn(selected.packages)
                  .map((p) => {
                    const isDuplicate = duplicateMenus.some((m) =>
                      m.packages.includes(p.id)
                    );
                    return isDuplicate
                      ? `<strong style="color:#d9534f; font-size:17px;">${
                          p.description || p.abbreviation
                        }</strong>`
                      : `<span>${p.description || p.abbreviation}</span>`;
                  })
                  .join(", ")}
              </div>
            </div>
      
            <hr style="margin:15px 0;">
            <p style="margin:0; font-size:13px;">
              <span style="color:#d9534f; font-weight:bold;">Red services</span> are already selected to this patient and also included in the new menu.<br>
              If you choose to <strong>override</strong>, these previously selected menus will be removed and replaced by the new menu's services.
            </p>
          </div>
        `,
      showCancelButton: true, // For Cancel
      showDenyButton: true, // For middle option
      confirmButtonText: "Yes, override",
      denyButtonText: "Keep current charges",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33", // Red for danger
      denyButtonColor: "#3085d6", // Blue for keep
      cancelButtonColor: "#6c757d", // Gray for cancel
    }).then((result) => {
      if (result.isConfirmed) {
        const overrideCart = [...cart].filter(
          (c) => !duplicateMenus.some((d) => c._id === d._id)
        );
        dispatch(OVERRIDE_CART([...overrideCart, selected]));
      } else if (result.isDenied) {
        dispatch(ADDTOCART(selected));
      }
    });
  };

  const servicesChecker = (servicesExisting, selected) => {
    const existingServices = Services.whereIn(servicesExisting.packages);
    const newServices = Services.whereIn(selected.packages);

    Swal.fire({
      title: "Overlapping Services Found",
      html: `
      <div style="text-align:left; font-size:14px; line-height:1.5;">
        <h6 style="margin-bottom:8px; color:#d9534f;">Existing Menu</h6>
        <div style="padding:8px; border:1px solid #f0ad4e; border-radius:6px; background:#fff3cd;">
          <div><strong>Menu:</strong> ${
            servicesExisting.description || servicesExisting.abbreviation
          }</div>
          <div><strong>Services:</strong> 
            ${existingServices
              .map((p) => {
                const isDuplicate = newServices.some((ns) => ns.id === p.id);
                return isDuplicate
                  ? `<strong style="color:#d9534f; font-size:17px;">${
                      p.description || p.abbreviation
                    }</strong>`
                  : `<span>${p.description || p.abbreviation}</span>`;
              })
              .join(", ")}
          </div>
        </div>

        <h6 style="margin:12px 0 8px; color:#5cb85c;">Newly Selected Menu</h6>
        <div style="padding:8px; border:1px solid #b2dfdb; border-radius:6px; background:#e0f2f1;">
          <div><strong>Menu:</strong> ${
            selected?.description || selected?.abbreviation
          }</div>
          <div><strong>Services:</strong>
            ${newServices
              .map((p) => `<span>${p.description || p.abbreviation}</span>`)
              .join(", ")}
          </div>
        </div>

        <hr style="margin:15px 0;">
      <p style="margin:0; font-size:13px;">
  Some services in the new menu you selected are <span style="color:#d9534f; font-weight:bold;">already included in the existing menu</span>.<br>
  Proceeding may cause these services to be charged again.
</p>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Proceed Anyway",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(ADDTOCART(selected));
      }
    });
  };

  const handleADDtoCart = (selected) => {
    const { packages = [] } = selected;

    const duplicateMenus = cart.filter(
      ({ packages: sp = [] }) =>
        sp?.every((p) => packages?.includes(p)) && sp?.length > 0
    );
    const servicesExisting = cart.find(
      ({ packages: sp = [] }) =>
        packages?.some((p) => sp?.includes(p)) &&
        sp?.length > packages?.length &&
        sp?.length > 0
    );

    if (duplicateMenus.length > 0 && packages?.length > 0) {
      duplicateMenusChecker(duplicateMenus, selected);
    } else if (servicesExisting?._id && packages?.length > 0) {
      servicesChecker(servicesExisting, selected);
    } else {
      dispatch(ADDTOCART(selected));
    }
  };
  const handleRemovedToCart = (_id) => dispatch(REMOVEFROMCART(_id));
  console.log("membership", membership);
  return (
    <>
      <div className="menus-table-container">
        <SearchMenu setMenu={handleADDtoCart} customer={customer} strict />
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

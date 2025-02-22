import React, { useState, useRef } from "react";
import { MDBIcon } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { Categories } from "../../../../../../services/fakeDb";
import Search from "./search";
import {
  computeGD,
  currency,
  globalSearch,
} from "../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import ConflictModal from "./conflictModal";
import {
  ADDTOCART,
  REMOVEFROMCART,
} from "../../../../../../services/redux/slices/commerce/pos.js";

const initialCompareState = {
  show: false,
  selected: {},
  conflicts: [],
};

export default function Menus({ patronPresent }) {
  const dispatch = useDispatch();
  const { collections } = useSelector(({ menus }) => menus);
  const [searchKey, setSearchKey] = useState("");
  const [compare, setCompare] = useState(initialCompareState);
  const [cart, setCart] = useState([]);
  const searchRef = useRef(null);
  const { addToast } = useToasts();

  const focusSearchInput = () => {
    if (searchRef.current) searchRef.current.focus();
  };

  const handlePicker = (selected) => {
    if (!cart.length) {
      setSearchKey("");
      focusSearchInput();
      return setCart([selected]);
    }

    const { packages, _id, description, abbreviation } = selected;
    const sameId = cart.find((c) => c?._id === _id);

    if (sameId)
      return addToast(`You already selected: ${description || abbreviation}`, {
        appearance: "info",
      });

    if (packages.length === 1) {
      const [_package] = packages;
      const duplicatePackage = cart.filter((c) =>
        c?.packages.includes(_package)
      );
      focusSearchInput();
      setSearchKey("");

      if (duplicatePackage.length)
        return setCompare({
          selected,
          conflicts: duplicatePackage,
          show: true,
        });

      return setCart([...cart, selected]);
    }

    let rawConflicts = [];
    for (const _package of packages) {
      const duplicatePackage = cart.filter((c) =>
        c?.packages.includes(_package)
      );
      if (duplicatePackage.length)
        rawConflicts = [...rawConflicts, ...duplicatePackage];
    }

    const conflicts = [
      ...new Map(rawConflicts.map((c) => [c._id, c])).values(),
    ];
    focusSearchInput();
    setSearchKey("");

    if (!conflicts.length) return setCart([...cart, selected]);

    setCompare({ selected, conflicts, show: true });
  };

  const handleConflict = (chosen) => {
    if (!chosen) return setCompare(initialCompareState);

    let updatedCart = cart.filter(
      (c) => !compare.conflicts.some(({ _id }) => _id === c._id)
    );
    setCart([...updatedCart, compare.selected]);
    setCompare(initialCompareState);
    addToast("Conflicts have been resolved.", { appearance: "info" });
  };

  const handleDelete = (_id) => setCart(cart.filter((c) => c?._id !== _id));
  const handleAddToCart = (item) => dispatch(ADDTOCART(item));
  const handleRemoveFromCart = (_id) => dispatch(REMOVEFROMCART(_id));

  return (
    <>
      <ConflictModal data={compare} handleConflict={handleConflict} />
      <table className="menus-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center">
                <Search
                  placeholder="Menu Search..."
                  searchKey={searchKey}
                  setSearchKey={setSearchKey}
                  searchRef={searchRef}
                />
              </div>
            </th>
          </tr>
          <tr>
            <th className="text-left">Services</th>
            <th style={{ width: "75px" }}>SRP</th>
            <th style={{ width: "75px" }}>
              <div className="d-flex align-items-center justify-content-center">
                UP
                <div className="menus-legend ml-2 m-0">
                  <MDBIcon
                    icon="info-circle"
                    size="sm"
                    className="text-info cursor-pointer"
                  />
                </div>
              </div>
            </th>
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
                    : "selecting a patron"}
                  .
                </span>
              </td>
            </tr>
          )}
          {cart.map((menu) => {
            const { _id, description, abbreviation } = menu;
            const {
              gross = 0,
              up = 0,
              title = "",
              color = "",
            } = computeGD(menu);

            return (
              <tr key={_id}>
                <td className="text-left">
                  {description && `${description} - `}
                  {abbreviation}
                </td>
                <td title="Suggested Retail Price">{currency(gross)}</td>
                <td title={title}>
                  <span className={`text-${color}`}>{currency(up)}</span>
                  <button
                    onClick={() => handleDelete(_id)}
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
    </>
  );
}

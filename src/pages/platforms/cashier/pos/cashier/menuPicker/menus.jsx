import React, { useState, useRef } from "react";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";
import { Categories } from "../../../../../../services/fakeDb";
import Search from "./search";
import {
  computeGD,
  currency,
  globalSearch,
} from "../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import ConflictModal from "./conflictModal";

const _compare = {
  show: false,
  selected: {},
  conflicts: [],
};

export default function Menus({
  categoryIndex,
  cart,
  setCart,
  patronPresent,
  privilegeIndex,
  didSearch,
  setDidSearch,
}) {
  const { collections } = useSelector(({ menus }) => menus),
    [searchKey, setSearchKey] = useState(""),
    [compare, setCompare] = useState(_compare),
    searchRef = useRef(null),
    { addToast } = useToasts();

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    setDidSearch(!didSearch);
  };

  const focusSearchInput = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handlePicker = (selected) => {
    // for the first menu, simply insert it
    if (!cart.length) {
      // empty the previous search.
      setSearchKey("");
      focusSearchInput(); // auto focus search input
      // setDidSearch(false); // auto close search input
      return setCart([selected]);
    }

    const { packages, _id, description, abbreviation } = selected;

    const sameId = cart.find((c) => c?._id === _id);

    // if a sameId is found, notify them.
    if (sameId)
      return addToast(`You already selected: ${description || abbreviation}`, {
        appearance: "info",
      });

    // if the selected menu only has 1 package, directly find it in the cart
    if (packages.length === 1) {
      const [_package] = packages;

      const duplicatePackage = cart.filter((c) =>
        c?.packages.includes(_package)
      );

      // reset before pushing or comparing
      focusSearchInput(); // auto focus search input
      // setDidSearch(false); // auto close search input
      setSearchKey("");

      // if a duplicate has been found, show for comparison
      if (!!duplicatePackage.length)
        return setCompare({
          selected,
          conflicts: duplicatePackage,
          show: true,
        });

      // if no duplicate found, proceed to push to cart
      return setCart([...cart, selected]);
    }

    let rawConflicts = [];

    // if selected menu has 2 or more packages
    for (const _package of packages) {
      const duplicatePackage = cart.filter((c) =>
        c?.packages.includes(_package)
      );

      // if no duplicate found, simply skip it
      if (!duplicatePackage.length) continue;

      // if a duplicate is found, add it in the conflicts
      rawConflicts = [...rawConflicts, ...duplicatePackage];
    }

    // remove all redundant ids in conflicts
    const conflicts = [
      ...new Map(rawConflicts.map((c) => [c._id, c])).values(),
    ];

    focusSearchInput(); // auto focus search input
    // setDidSearch(false); // auto close search input
    setSearchKey("");

    // if no conflicts found, simply push it
    if (!conflicts.length) return setCart([...cart, selected]);

    // if there are conflicts, show for comparison
    setCompare({
      selected,
      conflicts,
      show: true,
    });
  };

  const { abbr } = Categories[categoryIndex];

  const search = () => {
    if (!searchKey) return [];

    return globalSearch(collections, searchKey);
  };

  const searchMatch = search();

  // if chosen is true, remove all conflicts and push selected then reset compare state
  // if chosen is false, simply reset the compare state
  const handleConflict = (chosen) => {
    const { selected = {}, conflicts = [] } = compare;

    if (!chosen) return setCompare(_compare);

    // clone state
    let _cart = [...cart];

    // iterate conflcits to filter out each _id
    for (const { _id = "" } of conflicts)
      _cart = _cart.filter((c) => c?._id !== _id);

    // copy the filtered _cart and add the selected
    setCart([..._cart, selected]);

    setCompare(_compare);

    addToast(`Conflicts have been resolved.`, {
      appearance: "info",
    });
  };

  const handleDelete = (_id) => setCart(cart.filter((c) => c?._id !== _id));

  return (
    <>
      <ConflictModal
        data={compare}
        handleConflict={handleConflict}
        categoryIndex={categoryIndex}
        privilegeIndex={privilegeIndex}
      />
      <table className="menus-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center">
                <Search
                  info={{
                    message: "Search your menus",
                    description: "You can search by name or abbreviation.",
                  }}
                  placeholder="Menu Search..."
                  handleSearch={handleSearch}
                  searchKey={searchKey}
                  setSearchKey={setSearchKey}
                  didSearch={didSearch}
                  searchRef={searchRef}
                >
                  {!searchMatch.length && !searchKey && (
                    <li>Please type a menu name.</li>
                  )}
                  {!searchMatch.length && searchKey && <li>No match found.</li>}
                  {searchMatch?.map((menu, index) => {
                    const { description = "", abbreviation = "" } = menu,
                      price = menu[abbr];

                    return (
                      <li
                        key={`menu-suggestion-${index}`}
                        onClick={() => {
                          // isNew means its a new transaction, the prices will be shown
                          // this will be used when editing a transaction
                          if (price)
                            return handlePicker({ ...menu, isNew: true });

                          addToast(`This product has no set price.`, {
                            appearance: "warning",
                          });
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            {abbreviation}
                            {description && (
                              <>
                                <br />
                                <span className="small">{description}</span>
                              </>
                            )}
                          </span>
                          <span className="ml-3">
                            {price ? currency(price) : `??`}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </Search>
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
                  <div>
                    <ul>
                      <li className="menu-legend-lightblue">
                        Special Discount
                      </li>
                      <li className="menu-legend-yellow">Promo Price</li>
                      <li className="menu-legend-green">Discounted Price</li>
                      <li className="menu-legend-red">
                        Special services, discount is not applicable
                      </li>
                      <li className="menu-legend-black">
                        Suggested Retail Price
                      </li>
                    </ul>
                  </div>
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
                  Start by&nbsp;
                  {patronPresent
                    ? "searching your menus"
                    : "selecting a patron"}
                  .
                </span>
              </td>
            </tr>
          )}
          {cart.map((menu) => {
            const { _id, descritpion, abbreviation } = menu,
              {
                gross = 0,
                up = 0,
                title = "",
                color = "",
              } = computeGD(menu, categoryIndex, privilegeIndex);

            return (
              <tr key={_id}>
                <td className="text-left">
                  {descritpion && `${descritpion} - `}
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

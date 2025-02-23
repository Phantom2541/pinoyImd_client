import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./search";
import { MDBIcon } from "mdbreact";
import { Categories } from "../../../../../../services/fakeDb";
import { computeGD, currency, globalSearch } from "../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { ADDTOCART, REMOVEFROMCART } from "../../../../../../services/redux/slices/commerce/pos.js";

export default function Menus({ patronPresent }) {
  const { collections } = useSelector(({ menus }) => menus);
  const { category, privilege, cart } = useSelector(({ pos }) => pos);
  const [searchKey, setSearchKey] = useState("");
  const searchRef = useRef(null);
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  // Ensure abbr does not cause issues
  const { abbr } = Categories[category] || {};

  // Perform search within render
  const searchMatch = searchKey ? globalSearch(collections, searchKey) : [];

  console.log("Search Key:", searchKey);
  console.log("Search Results:", searchMatch); // Debugging output

  const handleADDtoCart = (item) => dispatch(ADDTOCART(item));
  const handleRemovedToCart = (_id) => dispatch(REMOVEFROMCART(_id));

  return (
    <>
      <table className="menus-table">
        <thead>
          <tr>
            <th colSpan="3" className="bg-white">
              <div className="d-flex justify-content-center">
                <SearchBox
                  handleSearch={(e) => {
                    e.preventDefault();
                    setSearchKey("");
                  }}
                  placeholder="Menu Search..."
                  setSearchKey={setSearchKey}
                  searchRef={searchRef}
                  searchKey={searchKey}
                >
                  {/* Debugging output */}
                  {searchMatch.length === 0 && !searchKey && <li>Please type a menu name.</li>}
                  {searchKey && searchMatch.length === 0 && <li>No match found.</li>}

                  {searchMatch.length > 0 &&
                    searchMatch.map((menu, index) => {
                      console.log("Menu Item:", menu); // Debugging

                      const { description = "", abbreviation = "" } = menu;
                      const price = menu[abbr] || 0; // Ensure a default price

                      return (
                        <li
                          key={`menu-suggestion-${index}`}
                          onClick={() => {
                            if (price) {
                              handleADDtoCart({ ...menu, isNew: true });
                            } else {
                              addToast("This product has no set price.", {
                                appearance: "warning",
                              });
                            }
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
                            <span className="ml-3">{price ? currency(price) : "N/A"}</span>
                          </div>
                        </li>
                      );
                    })}
                </SearchBox>
              </div>
            </th>
          </tr>
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
                  Start by {patronPresent ? "searching your menus" : "selecting a client"}.
                </span>
              </td>
            </tr>
          )}
          {cart.map((menu) => {
            const { _id, description, abbreviation } = menu;
            const { gross = 0, up = 0, title = "", color = "" } = computeGD(menu, category, privilege);

            return (
              <tr key={_id}>
                <td className="text-left">
                  {description ? `${description} - ` : ""}
                  {abbreviation}
                </td>
                <td title="Suggested Retail Price">{currency(gross)}</td>
                <td title={title}>
                  <span className={`text-${color}`}>{currency(up)}</span>
                  <button onClick={() => handleRemovedToCart(_id)} className="menus-button-delete">
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

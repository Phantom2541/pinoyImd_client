import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { debounce } from "lodash";
import {
  // GETENROLLED,
  RESET,
} from "./../../../services/redux/slices/assets/providers";
import { MDBIcon } from "mdbreact";

import Notification from "./notification";
import "../style.css";

export default function Search({ setEnrolled, setRegister = () => {} }) {
  const [searchKey, setSearchKey] = useState(""),
    [didSearch, setDidSearch] = useState(false),
    { enrolled, isLoading } = useSelector(({ providers }) => providers),
    // { activePlatform } = useSelector((state) => state.auth),
    dispatch = useDispatch();

  const handleChange = (e) => {
    // const _searchKey = e.target.value;
    // setSearchKey(_searchKey);
    // const searchKey = _searchKey.split(",");
    // const query = {
    //   vendors: activePlatform?.branchId,
    //   displayname: searchKey[0],
    //   name: searchKey[1] ? searchKey[1] : "",
    // };
  };

  const handleSelect = (user) => {
    setEnrolled(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleRegister = () => {
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  return (
    <div className="d-flex align-items-center" style={{ position: "relative" }}>
      <Notification didSearch={didSearch} />
      <div className={`searchable-search ${didSearch && "active"}`}>
        <div className="searchable-search-suggestions">
          {!enrolled?.length ? (
            <small onClick={handleRegister}>No Branch record found...</small>
          ) : (
            <ul>
              {enrolled?.map((provider) => {
                const { _id, name, subName } = provider;
                return (
                  <li onClick={() => handleSelect(provider)} key={_id}>
                    {name}, {subName}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <input
          disabled={isLoading}
          value={searchKey}
          onChange={handleChange}
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className={didSearch && !isLoading ? "bg-danger" : ""}
          onClick={
            didSearch
              ? () => {
                  setDidSearch(false);
                  setSearchKey("");
                }
              : () => console.log("search")
          }
        >
          <MDBIcon
            pulse={isLoading}
            icon={isLoading ? "spinner" : didSearch ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}

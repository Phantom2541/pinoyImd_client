import { MDBIcon } from "mdbreact";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./searchbox";
import { Patient, PosCard } from "./form";
import {
  fullName,
  fullNameSearch,
  getAge,
} from "../../../../../../services/utilities";

import { SETPRIVILEGE } from "../../../../../../services/redux/slices/commerce/checkout";

export default function PatientPicker({ setSelected, selected }) {
  const { collections, newPatient, isLoading } = useSelector(
      ({ users }) => users
    ),
    [searchKey, setSearchKey] = useState(""),
    [activeIndex, setActiveIndex] = useState(0),
    [didSearch, setDidSearch] = useState(false),
    dispatch = useDispatch();

  // if a newPatient id is present and active index is 1
  // it means a new patient has been injected, you should go back to POS
  useEffect(() => {
    if (newPatient?._id && activeIndex === 1) setActiveIndex(0);
  }, [newPatient, activeIndex]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    if (!didSearch && selected?._id) setSelected({});

    setDidSearch(!didSearch);
  };

  const searchMatch = fullNameSearch(searchKey, collections);
  const handlePrevilege = (e) => {
    dispatch(SETPRIVILEGE(e.target.value));
  };

  return (
    <div className="pos-container">
      <div
        className={`pos-container-header ${selected?._id && "pickedSearch"}`}
      >
        {selected?._id && (
          <h4>
            <MDBIcon icon="mars" className="text-primary mr-2" />
            {fullName(selected?.fullName)}
          </h4>
        )}

        <SearchBox
          handleSearch={handleSearch}
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          didSearch={didSearch}
          selected={selected}
        >
          {!searchMatch.length && !searchKey && (
            <li>Please type a fullname.</li>
          )}
          {!searchMatch.length && searchKey && (
            <li
              onClick={() => {
                if (isLoading) return;

                if (!activeIndex) setActiveIndex(1);
                setDidSearch(false);
              }}
            >
              {isLoading ? (
                <div className="text-center">
                  <MDBIcon pulse icon="spinner" />
                </div>
              ) : (
                "Add new client..."
              )}
            </li>
          )}
          {searchMatch?.map((user, index) => (
            <li
              key={`search-suggestion-${index}`}
              onClick={() => {
                setSelected(user);
                const { privilege = 0, dob } = user;

                // if current privilege is 0 but the customer is a valid senior, auto select senior as privilege
                if (privilege === 0 && getAge(dob, true) > 59)
                  handlePrevilege(2);

                setDidSearch(false);
              }}
            >
              <i
                className={`mr-2 ${
                  user?.isMale ? "fa fa-mars" : "fa fa-venus"
                }`}
              ></i>
              {fullName(user?.fullName)} |
              <span style={{ color: "blue" }}>{getAge(user?.dob)}</span>
            </li>
          ))}
        </SearchBox>
      </div>
      <div className="pos-card-button">
        {["Details", "Patient"]?.map((name, index) => {
          return (
            <button
              key={`button-${index}`}
              className={`${activeIndex === index && "active"}`}
              onClick={() => setActiveIndex(index)}
            >
              {name}
              <MDBIcon
                icon={name === "Details" ? "cash-register" : "user-injured"}
                className="pos-button-icon"
              />
            </button>
          );
        })}
      </div>
      <div className="pos-card">
        <div className="pos-card-body">
          <section className={`${activeIndex === 0 && "active"}`}>
            <PosCard selected={selected} />
          </section>
          <section className={`${activeIndex === 1 && "active"}`}>
            <Patient
              selected={selected}
              injectName={
                didSearch && !searchMatch.length && searchKey ? searchKey : ""
              }
            />
          </section>
        </div>
      </div>
    </div>
  );
}

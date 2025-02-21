import { MDBIcon } from "mdbreact";
import React, { useEffect, useState } from "react";
import Search from "./search";
import Patient from "./form/patient";
import PosCard from "./form/posCard";
import { useSelector } from "react-redux";
import {
  fullName,
  fullNameSearch,
  getAge,
} from "../../../../../../services/utilities";

export default function POS({
  setSelected,
  selected,
  setCategoryIndex,
  categoryIndex,
  privilegeIndex,
  setPrivilegeIndex,
  setPhysicianId,
  physicianId,
  setSourceId,
  sourceId,
}) {
  const { collections, newPatient, isLoading } = useSelector(
      ({ users }) => users
    ),
    [searchKey, setSearchKey] = useState(""),
    [activeIndex, setActiveIndex] = useState(0),
    [didSearch, setDidSearch] = useState(false);

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
        <Search
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
                "Add new patron..."
              )}
            </li>
          )}
          {searchMatch?.map((user, index) => (
            <li
              key={`search-suggestion-${index}`}
              onClick={() => {
                setSelected(user);
                const { privilege = 0, dob } = user;

                if (privilege !== privilegeIndex) setPrivilegeIndex(privilege);

                // if current privilege is 0 but the customer is a valid senior, auto select senior as privilege
                if (privilege === 0 && getAge(dob, true) > 59)
                  setPrivilegeIndex(2);

                setDidSearch(false);
              }}
            >
              <i
                className={`mr-2 ${
                  user?.isMale ? "fa fa-mars" : "fa fa-venus"
                }`}
              ></i>
              {fullName(user?.fullName)}|{" "}
              <span style={{ color: "blue" }}>{getAge(user?.dob)}</span>
            </li>
          ))}
        </Search>
      </div>
      <div className="pos-card-button">
        {["POS", "Patient"]?.map((name, index) => {
          return (
            <button
              key={`button-${index}`}
              className={`${activeIndex === index && "active"}`}
              onClick={() => setActiveIndex(index)}
            >
              {name}
              <MDBIcon
                icon={name === "POS" ? "cash-register" : "user-injured"}
                className="pos-button-icon"
              />
            </button>
          );
        })}
      </div>
      <div className="pos-card">
        <div className="pos-card-body">
          <section className={`${activeIndex === 0 && "active"}`}>
            <PosCard
              selected={selected}
              setCategoryIndex={setCategoryIndex}
              categoryIndex={categoryIndex}
              setPrivilegeIndex={setPrivilegeIndex}
              privilegeIndex={privilegeIndex}
              setPhysicianId={setPhysicianId}
              physicianId={physicianId}
              setSourceId={setSourceId}
              sourceId={sourceId}
            />
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

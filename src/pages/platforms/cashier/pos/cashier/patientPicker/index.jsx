import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBIcon } from "mdbreact";
import Search from "./search";
import Patient from "./form/patient";
import PosCard from "./form/posCard";
import {
  SETPATIENT,
  SETPRIVILEGE,
} from "../../../../../../services/redux/slices/commerce/pos";
import { fullName, getAge } from "../../../../../../services/utilities";

export default function POS() {
  const { collections, isLoading } = useSelector(({ users }) => users),
    { searchKey, customer } = useSelector(({ pos }) => pos),
    [activeIndex, setActiveIndex] = useState(0),
    [didSearch, setDidSearch] = useState(false),
    [searchMatch, setSearchMatch] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (collections.length > 0) {
      setSearchMatch([...collections]);
      setDidSearch(true);
    }
  }, [collections]);

  // if a newPatient id is present and active index is 1
  // it means a new patient has been injected, you should go back to POS
  // useEffect(() => {
  //   if (customer?._id && activeIndex === 1) setActiveIndex(0);
  // }, [customer, activeIndex]);

  const handleCustomer = customer => dispatch(SETPATIENT(customer));

  return (
    <div className="pos-container">
      <div
        className={`pos-container-header ${customer?._id && "pickedSearch"}`}
      >
        {customer?._id && (
          <h4>
            <MDBIcon icon="mars" className="text-primary mr-2" />
            {fullName(customer?.fullName)}
          </h4>
        )}
        <Search didSearch={didSearch}>
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
                handleCustomer(user);
                const { privilege = 0, dob } = user;

                // if current privilege is 0 but the customer is a valid senior, auto select senior as privilege
                if (privilege === 0 && getAge(dob, true) > 59)
                  dispatch(SETPRIVILEGE(2));
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
            <PosCard />
          </section>
          <section className={`${activeIndex === 1 && "active"}`}>
            <Patient />
          </section>
        </div>
      </div>
    </div>
  );
}

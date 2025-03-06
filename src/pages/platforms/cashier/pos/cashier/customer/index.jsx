import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon } from "mdbreact";
import Patient from "./form/patient";
import PosCard from "./form/posCard";
import {
  SETPATIENT,
  SETSEARCHKEY,
} from "../../../../../../services/redux/slices/commerce/pos";
import { fullName } from "../../../../../../services/utilities";
import { SearchUser as Search } from "../../../../../../components/searchables";

export default function POS() {
  const { isLoading } = useSelector(({ users }) => users),
    { customer } = useSelector(({ pos }) => pos),
    [activeIndex, setActiveIndex] = useState(0),
    dispatch = useDispatch();

  // if a newPatient id is present and active index is 1
  // it means a new patient has been injected, you should go back to POS
  // useEffect(() => {
  //   if (customer?._id && activeIndex === 1) setActiveIndex(0);
  // }, [customer, activeIndex]);

  const handleCustomer = (customer) => dispatch(SETPATIENT(customer));

  const handleRegister = (customer) => {
    if (isLoading) return;
    if (!activeIndex) setActiveIndex(1);
    dispatch(SETSEARCHKEY(customer));
  };

  console.log("customer:", customer);

  return (
    <div className="pos-container ">
      <div
        className={`pos-container-header  ${customer?._id && "pickedSearch"}`}
      >
        {customer?._id && (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <div>
              <h5 style={{ fontWeight: "500" }}>
                <MDBIcon icon="mars" className="text-primary mr-2" />
                {fullName(customer?.fullName)}{" "}
              </h5>
            </div>
            <MDBBtn
              rounded
              color="danger"
              title="Clear"
              size="sm"
              onClick={() => dispatch(SETPATIENT({}))}
              className="px-2"
            >
              <MDBIcon icon="times" />
            </MDBBtn>
          </div>
        )}
        {!customer?.fullName && (
          <div style={{ width: "90%" }}>
            <Search setPatient={handleCustomer} setRegister={handleRegister} />
          </div>
        )}
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

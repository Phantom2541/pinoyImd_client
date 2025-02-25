import React, { useState, useEffect } from "react";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import Departments from "./../../../../../../../services/fakeDb/templates";
const Header = ({
  year,
  setYear,
  month,
  setMonth,
  hasAction,
  handleCreate,
}) => {
  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-2">xxxx </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <select
            className="browser-default custom-select"
            style={{ width: "100px", marginRight: "10px" }}
            value={month}
            onChange={setMonth}
          >
            <option selected disabled>
              Month
            </option>
            {Array.from({ length: 12 }).map((index, i) => (
              <option key={i + 1} value={i + 1}>
                {Months[i]}
              </option>
            ))}
          </select>

          <select
            className="browser-default custom-select"
            style={{ width: "100px", marginRight: "10px" }}
            value={year}
            onChange={setYear}
          >
            <option selected disabled>
              Year
            </option>

            {Array.from({ length: 3 }).map((index, i) => (
              <option key={i + 2023} value={i + 2023}>
                {i + 2023}
              </option>
            ))}
          </select>

          {hasAction && (
            <MDBBtn
              size="sm"
              className="px-2"
              rounded
              color="success"
              onClick={handleCreate}
            >
              <MDBIcon icon="plus" />
            </MDBBtn>
          )}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

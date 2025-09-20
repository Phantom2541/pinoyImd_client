// import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SetSCHED,
  SetFILTERED,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { Search } from "../../../../../components/searchables";
const Header = () => {
  const { collections, scheds, activeSched, filtered } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

  //initial values
  const appointmentCount = filtered?.length;
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">
          {appointmentCount ? appointmentCount : ""} Apointments
        </span>
      </div>
      <div className="white-text mx-3 text-nowrap mt-0 d-flex align-items-center ml-n5">
        <span className="mr-2">Schedule:</span>
        <select
          className="form-control bg-light"
          value={activeSched}
          onChange={({ target }) => {
            dispatch(SetSCHED({ sched: target.value }));
          }}
        >
          <option value="">All</option>
          {scheds.map((sched) => (
            <option key={sched} value={sched}>
              {sched}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Search
          haveAction={false}
          collections={collections}
          setFiltered={(results) => dispatch(SetFILTERED(results))}
          reset={() => dispatch(SetFILTERED(collections))}
        />
      </div>
    </MDBView>
  );
};

export default Header;

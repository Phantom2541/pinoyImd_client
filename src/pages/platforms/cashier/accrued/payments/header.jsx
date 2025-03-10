import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBIcon, MDBView, MDBBtn } from "mdbreact";
import {
  // RESET,
  BROWSE,
  SetCREATE,
  SetFILTERByCategories,
} from "../../../../../services/redux/slices/finance/journals/payments.js";
import {
  SearchMonth as Month,
  SearchYear as Year,
  Statements,
} from "./components";

export default function TopHeader() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [year, setYear] = useState(new Date().getFullYear()),
    [month, setMonth] = useState(new Date().getMonth()),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            year,
            month,
          },
        })
      );
    }
    // return () => dispatch(RESET());
  }, [token, activePlatform, year, month, dispatch]);

  const handleCategories = (categories) => {
    dispatch(SetFILTERByCategories(categories));
    // console.log(categories);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Payments </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Statements setCategories={handleCategories} />
          {/* <Templates setTemplate={setTemplate} /> */}
          <Month month={month} setMonth={setMonth} />
          <Year year={year} setYear={setYear} />
          <MDBBtn
            size="sm"
            className="px-3"
            rounded
            color="Secondary"
            onClick={() => dispatch(SetCREATE({}))}
          >
            <MDBIcon icon="plus" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
}

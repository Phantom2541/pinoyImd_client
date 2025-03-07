import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./calendar";
import { MDBCard, MDBContainer } from "mdbreact";
import {
  CENSUS,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import "./style.css";
// import { Calendar as calendar } from "./../../../../../services/fakeDb";
import Header from "./header";

// create new api, for ledger browse.
// if ledger is empty, notify to generate
// must wait for the process to complete

const today = new Date();

export default function Remmitances() {
  const [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month)
      dispatch(
        CENSUS({
          token,
          key: {
            user: auth._id,
            branchId: activePlatform?.branchId,
            start: new Date(year, month, 0),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
          },
        })
      );

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year, auth]);

  return (
    <MDBContainer className="d-grid" fluid>
      <MDBCard className="pb-3" narrow>
        <Header />
        <Calendar month={month} year={year} />
      </MDBCard>
    </MDBContainer>
  );
}

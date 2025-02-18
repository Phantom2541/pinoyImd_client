import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow, MDBCard, MDBCardHeader, MDBCardBody } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { OLDLEDGER } from "../../../../../services/redux/slices/commerce/sales";
import POS from "./pos";
import Gross from "./gross";
import Monthly from "./month";
import Yearly from "./year";

const today = new Date();

export default function CashierSales() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    [currentYear, setCurrentYear] = useState(), //today.getFullYear()
    [currentMonth, setCurrentMonth] = useState(), //today.getMonth()
    [activeIndex, setActiveIndex] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    const d = new Date();
    setCurrentMonth(d.getMonth() + 1);
    setCurrentYear(d.getFullYear());
    if (activePlatform && activePlatform?.branchId) {
      dispatch(
        OLDLEDGER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            month: d.getMonth() + 1,
            year: d.getFullYear(),
            // start: new Date(currentYear, currentMonth, 0),
            // end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
          },
        })
      );
    }
  }, [activePlatform, token, dispatch]);

  const handleMonth = (m) => {
    console.log(m);
    // this.Browse(month, year);
    setActiveIndex(0);
    if (m != currentMonth) {
      dispatch(
        OLDLEDGER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            month: m,
            year: currentYear,
          },
        })
      );
      setCurrentMonth(m);
    } else {
      alert("lol");
    }
  };
  const handleYear = (year) => {
    // this.Browse(month, year);
    setActiveIndex(0);
    if (year !== currentYear) {
      setCurrentYear(year);
    }
    dispatch(
      OLDLEDGER({
        token,
        key: {
          branchId: activePlatform?.branchId,
          month: currentMonth,
          year,
        },
      })
    );
  };

  return (
    <>
      <MDBCard>
        <MDBCardHeader>
          <MDBRow>
            <MDBCol md="3">
              <Monthly month={currentMonth} handleMonth={handleMonth} />
            </MDBCol>
            <MDBCol md="3">
              <Yearly year={currentYear} handleYear={handleYear} />
            </MDBCol>
            <MDBCol md="6">
              <Gross />
            </MDBCol>
          </MDBRow>
        </MDBCardHeader>
        <MDBCardBody>
          <POS activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        </MDBCardBody>
      </MDBCard>
    </>
  );
}

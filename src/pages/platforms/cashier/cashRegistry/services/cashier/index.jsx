import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Customer from "./customer";
import Purchase from "./purchase";
import Summary from "./summary";
import "./style.css";
import { MDBCol, MDBRow } from "mdbreact";
import {
  AUTOSELECT,
  SetSELECTED,
  TOGGLE,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import Denominations from "../remittances/modal/denominations";
import { ClaimStub } from "../../../../../../components/printout";

export default function Cashier() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth);
  const { transaction, onPrint } = useSelector(({ deals }) => deals);
  const dispatch = useDispatch();
  const hasFetched = useRef(false),
    date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const selected = JSON.parse(localStorage?.getItem("floatingcash"));
    if (selected) {
      dispatch(SetSELECTED({ value: selected }));
    } else {
      dispatch(
        AUTOSELECT({
          token,
          key: {
            branch: activePlatform.branchId,
            cashier: auth._id,
            date,
          },
        })
      ).then(({ payload }) => {
        const { data } = payload;
        if (data !== null) {
          localStorage.setItem("floatingcash", JSON.stringify(data));
          dispatch(SetSELECTED({ value: data }));
        } else {
          dispatch(TOGGLE({ key: "open", value: new Date().getUTCDate() }));
        }
      });
    }
  }, [activePlatform, auth, token, dispatch, date]);

  if (onPrint) {
    return <ClaimStub />;
  }
  return (
    <MDBRow
      className="res-container"
      style={{ marginLeft: "4rem", marginRight: "1rem" }}
    >
      <MDBCol size="5" className="pr-1">
        <Customer />
      </MDBCol>
      <MDBCol size="4" className="px-1">
        <Purchase />
      </MDBCol>
      <MDBCol size="3" className="px-1">
        <Summary />
      </MDBCol>
      <Denominations />
    </MDBRow>
  );
}

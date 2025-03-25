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
import Denominations from "./../remmitances/modal/denominations";

export default function Cashier() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth);
  const { transaction, isSuccess } = useSelector(({ deals }) => deals);
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const _selected = JSON.parse(localStorage?.getItem("floatingcash"));
    if (_selected) {
      dispatch(SetSELECTED({ value: _selected }));
    } else {
      const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      const date = new Date(options);

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
        if (payload !== null) {
          localStorage.setItem("floatingcash", JSON.stringify(payload));
          dispatch(SetSELECTED({ value: payload }));
        } else {
          dispatch(TOGGLE({ key: "open", value: new Date().getUTCDate() }));
        }
      });
    }
  }, [activePlatform, auth, token, dispatch]);

  useEffect(() => {
    if (transaction?._id !== "default" && isSuccess) {
      localStorage.setItem("claimStub", JSON.stringify(transaction));
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=100px,width=550px,height=750px"
      );
    }
  }, [transaction, isSuccess]);

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

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Customer from "./customer";
import Purchase from "./purchase";
import Summary from "./summary";
import { useSelector } from "react-redux";
import "./style.css";
import { MDBCol, MDBRow } from "mdbreact";
import {
  AUTOSELECT,
  SetSELECTED,
  TOGGLE,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import Denominations from "./../remmitances/modal/denominations";

export default function Cashier() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { transaction, isSuccess } = useSelector(({ deals }) => deals),
    { selected } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();
  useEffect(() => {
    const _selected = JSON.parse(localStorage?.getItem("floatingcash"));
    if (_selected) {
      dispatch(SetSELECTED({ value: _selected }));
      console.log("selected", _selected);
    } else {
      const options = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      const formatter = new Intl.DateTimeFormat("en-CA", options);
      const date = formatter.format(new Date());

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
        if (payload !== null)
          localStorage.setItem("floatingcash", JSON.stringify(payload));
        else {
          dispatch(TOGGLE({ key: "open", value: new Date().getUTCDate() }));
        }
      });
    }
  }, [activePlatform, auth, token, selected, dispatch]);
  // transaction printout
  useEffect(() => {
    if (transaction?._id !== "default" && isSuccess) {
      localStorage.setItem("claimStub", JSON.stringify(transaction));
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=100px,width=550px,height=750px"
      );
    }
  }, [transaction, isSuccess, activePlatform]);

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

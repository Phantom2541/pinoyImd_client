import React, { useEffect } from "react";
import { MDBCol, MDBRow } from "mdbreact";
import POS from "./patientPicker/pos";
import Menus from "./menuPicker/menus";
import Summary from "./summary/index";
import { useSelector } from "react-redux";
import "./index.css";

export default function Cashier() {
  const { onDuty } = useSelector(({ auth }) => auth),
    { transaction, isSuccess } = useSelector(({ sales }) => sales);

  // transaction printout
  // reset all transaction
  useEffect(() => {
    if (transaction?._id !== "default" && isSuccess) {
      localStorage.setItem("claimStub", JSON.stringify(transaction));
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=100px,width=550px,height=750px"
      );
    }
  }, [transaction, isSuccess, onDuty]);

  return (
    <MDBRow className="res-container">
      <MDBCol size="5" className="pr-1">
        <POS />
      </MDBCol>
      <MDBCol size="4" className="px-1">
        <Menus />
      </MDBCol>
      <MDBCol size="3" className="px-1">
        <Summary />
      </MDBCol>
    </MDBRow>
  );
}

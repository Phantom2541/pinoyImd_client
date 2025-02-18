import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PatientPicker from "./patientPicker";
import MenuPicker from "./menuPicker";
import Summary from "./Summary";
import {
  PATIENTS,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/users";
import "./index.css";
import { MDBCol, MDBRow } from "mdbreact";
import { SETCASHIER } from "../../../../../services/redux/slices/commerce/checkout";

//detect if searchKey is empty

export default function Cashier() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { newPatient } = useSelector(({ users }) => users),
    { branchId, cashierId, transaction, isSuccess } = useSelector(
      ({ checkout }) => checkout
    ),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  // transaction printout
  // reset all transaction
  // check if we can auto generate task
  useEffect(() => {
    if (transaction?._id !== "default" && isSuccess) {
      localStorage.setItem("claimStub", JSON.stringify(transaction));
      window.open(
        "/printout/claimstub",
        "Claim Stub",
        "top=100px,left=100px,width=550px,height=750px"
      );

      // reset everything
      setSelected({});
    }
  }, [transaction, isSuccess, activePlatform]);

  // if a new patient is created
  // automatically set it as selected and go to POS
  useEffect(() => {
    if (newPatient?._id) {
      setSelected(newPatient);
    }
  }, [newPatient]);

  useEffect(() => {
    if (token && activePlatform?._id) {
      dispatch(
        SETCASHIER({
          branchId: activePlatform.companyId._id,
          cashierId: auth._id,
        })
      );

      dispatch(PATIENTS({ token }));
      return () => {
        dispatch(RESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  // check if a patron has been selected
  const patronPresent = Boolean(selected?._id);

  return (
    <MDBRow className="res-container">
      <MDBCol size="5" className="pr-1">
        <PatientPicker setSelected={setSelected} selected={selected} />
      </MDBCol>
      <MDBCol size="4" className="px-1">
        <MenuPicker patronPresent={patronPresent} />
      </MDBCol>
      <MDBCol size="3" className="px-1">
        <Summary />
      </MDBCol>
    </MDBRow>
  );
}

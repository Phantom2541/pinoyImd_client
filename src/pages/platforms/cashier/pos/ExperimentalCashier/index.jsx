import React, { useEffect, useState } from "react";
import POS from "./patientPicker/pos";
import Menus from "./menuPicker/menus";
import Summary from "./summary/index";
import { useDispatch, useSelector } from "react-redux";
import {
  PATIENTS,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/users";
import {
  BROWSE as MENUS,
  RESET as MENUSRESET,
} from "../../../../../services/redux/slices/commerce/menus";
import {
  TIEUPS as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import "./index.css";
import { MDBCol, MDBRow } from "mdbreact";

//detect if searchKey is empty

export default function Cashier() {
  const { token, onDuty } = useSelector(({ auth }) => auth),
    { newPatient } = useSelector(({ users }) => users),
    { transaction, isSuccess } = useSelector(({ sales }) => sales),
    [selected, setSelected] = useState({}),
    [menuSearch, setMenuSearch] = useState(false), // used to auto close menu if open upon submission
    [cart, setCart] = useState([]),
    [categoryIndex, setCategoryIndex] = useState(0),
    [privilegeIndex, setPrivilegeIndex] = useState(0),
    [sourceId, setSourceId] = useState(""),
    [physicianId, setPhysicianId] = useState(""),
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
      setCart([]);
      setCategoryIndex(0);
      setPrivilegeIndex(0);
      setSourceId("");
      setPhysicianId("");

      // trigger auto generate task
    }
  }, [transaction, isSuccess, onDuty]);

  // if a new patient is created
  // automatically set it as selected and go to POS
  useEffect(() => {
    if (newPatient?._id) {
      setSelected(newPatient);
    }
  }, [newPatient]);

  useEffect(() => {
    if (token && onDuty?._id) {
      dispatch(PATIENTS({ token }));
      dispatch(SOURCELIST({ token, key: { clients: onDuty._id } }));
      dispatch(PHYSICIANS({ key: { branch: onDuty._id }, token }));
      dispatch(MENUS({ key: { branchId: onDuty._id }, token }));

      return () => {
        dispatch(RESET());
        dispatch(MENUSRESET());
        dispatch(SOURCERESET());
        dispatch(PHYSICIANRESET());
      };
    }
  }, [token, dispatch, onDuty]);

  // check if a patron has been selected
  const patronPresent = Boolean(selected?._id);

  return (
    <MDBRow className="res-container">
      <MDBCol size="5" className="pr-1">
        <POS
          setSelected={setSelected}
          selected={selected}
          setCategoryIndex={setCategoryIndex}
          categoryIndex={categoryIndex}
          setPrivilegeIndex={setPrivilegeIndex}
          privilegeIndex={privilegeIndex}
          setPhysicianId={setPhysicianId}
          physicianId={physicianId}
          setSourceId={setSourceId}
          sourceId={sourceId}
        />
      </MDBCol>
      <MDBCol size="4" className="px-1">
        <Menus
          didSearch={menuSearch}
          setDidSearch={setMenuSearch}
          categoryIndex={categoryIndex}
          privilegeIndex={privilegeIndex}
          setCart={setCart}
          cart={cart}
          patronPresent={patronPresent}
        />
      </MDBCol>
      <MDBCol size="3" className="px-1">
        <Summary
          // called upon submission to reset customer
          resetCustomer={() => {
            setSelected({});
            if (menuSearch) setMenuSearch(false);
          }}
          customer={{
            fullName: selected?.fullName,
            mobile: selected?.mobile,
            privilege: selected?.privilege,
            address: `${
              selected?.address?.barangay && `${selected?.address?.barangay}, `
            }${selected?.address?.city}`,
          }}
          patronPresent={patronPresent}
          cart={cart}
          categoryIndex={categoryIndex}
          physicianId={physicianId}
          sourceId={sourceId}
          privilegeIndex={privilegeIndex}
          customerId={selected?._id}
        />
      </MDBCol>
    </MDBRow>
  );
}

import React from "react";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBRow } from "mdbreact";
import {
  getAge,
  getGenderIcon,
  fullName as nameFormatter,
} from "../../../../../../../../services/utilities";
import PatientCategories from "./categories";
import PatientPrivileges from "./privileges";
import PatientSources from "./sources";
import PatientPhysicians from "./physicians";
import PatientCart from "./cart";

export default function CashierPatient({
  setSourceVendor,
  gross,
  discount,
  cart,
  setCart,
  categoryIndex,
  patient,
  setCategoryIndex,
  privilegeIndex,
  setPrivilegeIndex,
  setPhysicianId,
  didCheckout,
  toggleCheckout,
}) {
  const { fullName, isMale, dob, privilege } = patient;

  return (
    <MDBCol md="5" className={didCheckout ? "pr-0 offset-md-2" : "pl-0"}>
      <MDBCard className="h-100">
        <MDBCardBody>
          <MDBCardTitle>
            <MDBRow style={{ cursor: "default" }}>
              <MDBCol
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                size="9"
                title={nameFormatter(fullName, true)}
              >
                {getGenderIcon(isMale)}
                {nameFormatter(fullName, true)}
              </MDBCol>
              <MDBCol size="3" className="text-right">
                {getAge(dob)}
              </MDBCol>
            </MDBRow>
          </MDBCardTitle>
          <MDBRow>
            <PatientCategories
              didCheckout={didCheckout}
              categoryIndex={categoryIndex}
              setCategoryIndex={setCategoryIndex}
            />
            <PatientPrivileges
              didCheckout={didCheckout}
              patientAge={getAge(dob, true)}
              patientPrivilege={privilege}
              privilegeIndex={privilegeIndex}
              setPrivilegeIndex={setPrivilegeIndex}
            />
            <PatientSources
              didCheckout={didCheckout}
              setSourceVendor={setSourceVendor}
            />
            <PatientPhysicians
              didCheckout={didCheckout}
              setPhysicianId={setPhysicianId}
            />
          </MDBRow>
          <PatientCart
            saleId={patient.saleId}
            gross={gross}
            discount={discount}
            cart={cart}
            setCart={setCart}
            categoryIndex={categoryIndex}
            didCheckout={didCheckout}
            toggleCheckout={toggleCheckout}
            privilegeIndex={privilegeIndex}
          />
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
}

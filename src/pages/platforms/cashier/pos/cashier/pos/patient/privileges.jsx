import React from "react";
import {
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { Privileges } from "../../../../../../../services/fakeDb";

export default function PatientPrivileges({
  patientAge,
  patientPrivilege,
  privilegeIndex,
  setPrivilegeIndex,
  didCheckout,
}) {
  return (
    <MDBCol md="6">
      <MDBSelect
        getValue={e => setPrivilegeIndex(Number(e[0]))}
        className="colorful-select dropdown-primary mt-2 hidden-md-down"
      >
        <MDBSelectInput
          selected={
            privilegeIndex > 0 ? Privileges[privilegeIndex] : "Privilege"
          }
        />
        <MDBSelectOptions>
          {Privileges.map((privilege, index) => (
            <MDBSelectOption
              disabled={
                didCheckout ||
                (privilege === "None" && patientPrivilege > 0) ||
                (privilege === "Senior Citizen" && patientAge < 60)
              }
              key={`privilege-${index}`}
              value={String(index)}
            >
              {privilege}
            </MDBSelectOption>
          ))}
        </MDBSelectOptions>
      </MDBSelect>
    </MDBCol>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import {
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { Privileges } from "../../../../../../../../services/fakeDb";

export default function PatientPrivileges({
  patientAge,
  patientPrivilege,
  setPrivilegeIndex,
  didCheckout,
}) {
  const { selected } = useSelector(({ deals }) => deals);

  return (
    <MDBCol md="6">
      <input
        type="text"
        readOnly
        name="privilege"
        className="form-control"
        value={`Privilege: ${Privileges[selected.privilege]}`}
      />
      {/* <MDBSelect
        getValue={(e) => setPrivilegeIndex(Number(e[0]))}
        className="colorful-select dropdown-primary mt-2 hidden-md-down "
        options={{ options: false }}
      >
        <MDBSelectInput selected={Privileges[selected.privilege]} />
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
      </MDBSelect> */}
    </MDBCol>
  );
}

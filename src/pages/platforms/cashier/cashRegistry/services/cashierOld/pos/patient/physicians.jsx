import React from "react";
import { MDBCol } from "mdbreact";
import { useSelector } from "react-redux";
import { properFullname } from "../../../../../../../../services/utilities";

export default function PatientPhysicians({ setPhysicianId, didCheckout }) {
  const { selected } = useSelector(({ deals }) => deals);

  // console.log("PatientPhysicians selected :", selected.physicianId);

  return (
    <MDBCol md="6">
      <input
        type="text"
        readOnly
        name="physician"
        className="form-control"
        value={`Physician: ${properFullname(selected?.physicianId?.fullName)}`}
      />
      {/* <MDBSelect
        getValue={(e) => setPhysicianId(e[0])}
        className="colorful-select dropdown-primary mt-0 hidden-md-down"
      >
        <MDBSelectInput
          selected={properFullname(selected?.physicianId?.fullName)}
        />
        <MDBSelectOptions>
          <MDBSelectOption value="">Physician</MDBSelectOption>
          {collections.map(({ user }, index) => (
            <MDBSelectOption
              disabled={didCheckout}
              key={`physician-${index}`}
              value={user?._id}
            >
              {properFullname(user?.fullName)}
            </MDBSelectOption>
          ))}
        </MDBSelectOptions>
      </MDBSelect> */}
    </MDBCol>
  );
}

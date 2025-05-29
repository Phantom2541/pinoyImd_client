import React from "react";
import {
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { useSelector } from "react-redux";

export default function PatientSources({ didCheckout }) {
  const { collections } = useSelector(({ providers }) => providers),
    { selected } = useSelector(({ deals }) => deals);

  return (
    <MDBCol md="6">
      <input
        type="text"
        readOnly
        name="source"
        className="form-control"
        value={`Source: ${
          selected?.source ? selected?.source?.displayname : "-"
        }`}
      />
      {/* <MDBSelect className="colorful-select dropdown-primary mt-0 hidden-md-down">
        <MDBSelectInput selected={selected?.source?.displayname} />
        <MDBSelectOptions>
          <MDBSelectOption value="">Source</MDBSelectOption>
          {collections?.map(({ name, subName, vendors }, index) => (
            <MDBSelectOption
              disabled={didCheckout}
              key={`source-${index}`}
              value={vendors?._id}
            >
              {name}
              {subName && `/ ${subName}`}
            </MDBSelectOption>
          ))}
        </MDBSelectOptions>
      </MDBSelect> */}
    </MDBCol>
  );
}

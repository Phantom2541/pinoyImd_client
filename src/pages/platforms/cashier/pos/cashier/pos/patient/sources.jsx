import React from "react";
import {
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { useSelector } from "react-redux";

export default function PatientSources({ didCheckout, setSourceVendor }) {
  const { collections } = useSelector(({ providers }) => providers);

  return (
    <MDBCol md="6">
      <MDBSelect
        getValue={(e) => setSourceVendor(e[0])}
        className="colorful-select dropdown-primary mt-0 hidden-md-down"
      >
        <MDBSelectInput selected="Source" />
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
      </MDBSelect>
    </MDBCol>
  );
}

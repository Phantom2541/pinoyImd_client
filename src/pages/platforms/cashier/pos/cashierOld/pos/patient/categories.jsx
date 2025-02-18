import React from "react";
import {
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { Categories } from "../../../../../../../services/fakeDb";

export default function PatientCategories({
  setCategoryIndex,
  didCheckout,
  categoryIndex,
}) {
  return (
    <MDBCol md="6">
      <MDBSelect
        getValue={e => setCategoryIndex(Number(e[0]))}
        className="colorful-select dropdown-primary mt-2 hidden-md-down"
      >
        <MDBSelectInput
          selected={!categoryIndex ? "Walkin" : Categories[categoryIndex].name}
        />
        <MDBSelectOptions>
          {Categories.map((category, index) => (
            <MDBSelectOption
              disabled={didCheckout}
              key={`category-${index}`}
              value={String(index)}
            >
              {category.name}
            </MDBSelectOption>
          ))}
        </MDBSelectOptions>
      </MDBSelect>
    </MDBCol>
  );
}

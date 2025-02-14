import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { MAXPAGE } from "../../services/redux/slices/assets/persons/auth";

export default function TableRowCount({ disablePageSelect }) {
  const { maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleChange = option => dispatch(MAXPAGE(Number(option[0])));

  return (
    <MDBSelect
      getValue={handleChange}
      className={`colorful-select dropdown-primary mt-2 hidden-md-down ${
        disablePageSelect && "invisible"
      }`}
    >
      <MDBSelectInput selected={`${maxPage} rows`} />
      <MDBSelectOptions>
        <MDBSelectOption value="5">5 rows</MDBSelectOption>
        <MDBSelectOption value="25">25 rows</MDBSelectOption>
        <MDBSelectOption value="50">50 rows</MDBSelectOption>
        <MDBSelectOption value="100">100 rows</MDBSelectOption>
      </MDBSelectOptions>
    </MDBSelect>
  );
}

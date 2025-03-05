import { Denominations } from "../../../../../services/fakeDb";
import {
  MDBBtn,
  MDBInput,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

export default function Remmitances({ title }) {
  return (
    <div className="mt-3">
      <h5 className="text-center">{title}</h5>
      <div className="d-flex justify-content-between">
        <MDBInput label="Amount" type="number" />
        <MDBSelect>
          <MDBSelectInput label="Mode" />
          <MDBSelectOptions>
            <MDBSelectOption value="1">Cash</MDBSelectOption>
            <MDBSelectOption value="2">Check</MDBSelectOption>
            <MDBSelectOption value="3">Card</MDBSelectOption>
          </MDBSelectOptions>
        </MDBSelect>
        <MDBBtn color="primary">Save</MDBBtn>
      </div>
      <Denominations />
    </div>
  );
}

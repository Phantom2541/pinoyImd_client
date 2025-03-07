import React from "react";
import { MDBInput, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import { useSelector } from "react-redux";
import AddressSelect from "../../../../../../components/searchables/addressSelect";

export default function AddressInformation({ handleChange, form, willCreate }) {
  const { isLoading } = useSelector(({ users }) => users);

  const { address } = form;

  return (
    <>
      <AddressSelect address={address} handleChange={handleChange} />
      <MDBRow>
        <MDBCol md="9">
          <MDBInput
            type="text"
            label="Street (Optional)"
            value={address.street}
            onChange={(e) =>
              handleChange("address", { ...address, street: e.target.value })
            }
          />
        </MDBCol>
        <MDBCol md="3" className="d-flex align-items-bottom">
          <MDBBtn
            disabled={isLoading}
            color="info"
            type="submit"
            className="w-100 m-auto"
          >
            {willCreate ? "submit" : "update"}
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </>
  );
}

import React from "react";
import {
  MDBCol,
  MDBRow,
  MDBTypography,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBModal,
} from "mdbreact";
import CompanyCard from "./card";
import { PresetUser } from "../../../../../services/utilities";

export default function CompanyCards({ companies }) {
  return (
    <>
      <MDBTypography note noteColor="info" className="text-center">
        <strong>Instructions: </strong>
        Click a card to send a request form.
      </MDBTypography>

      <MDBRow>
        {!!companies.length ? (
          companies.map(company => (
            <CompanyCard key={company._id} company={company} />
          ))
        ) : (
          <MDBCol size="4" className="mb-4">
            <MDBCard>
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={PresetUser}
                  className="mb-3 img-thumbnail bg-transparent"
                  style={{ height: 200, width: "auto" }}
                />
                <MDBCardTitle>No available companies</MDBCardTitle>
                <label>The list is simply empty.</label>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        )}
      </MDBRow>
    </>
  );
}

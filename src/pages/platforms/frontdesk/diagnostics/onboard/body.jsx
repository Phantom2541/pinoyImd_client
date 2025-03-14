import React from "react";
import { useSelector } from "react-redux";
import { MDBTypography, MDBCol, MDBRow } from "mdbreact";
import Card from "./card";

const Body = () => {
  const { collections, isLoading } = useSelector(
    ({ taskGenerator }) => taskGenerator
  );

  return (
    <>
      {!collections?.length && !isLoading && (
        <MDBTypography noteColor="info" note>
          Sales are emptys
        </MDBTypography>
      )}
      <MDBRow>
        {collections?.map((sale, index) => (
          <MDBCol md="4" key={index}>
            <Card index={index} item={sale} />
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
};

export default Body;

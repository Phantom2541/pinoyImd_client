import React from "react";
import { useSelector } from "react-redux";
import { MDBTypography, MDBRow, MDBCardBody } from "mdbreact";
import Card from "./card";

const Body = () => {
  const { collections, isLoading } = useSelector(
    ({ taskGenerator }) => taskGenerator
  );

  return (
    <MDBCardBody>
      {!collections?.length && !isLoading && (
        <MDBTypography noteColor="info" note>
          Tasks are empty
        </MDBTypography>
      )}
      <MDBRow>
        {collections?.map((sale, index) => (
          <Card
            item={sale}
            index={collections.length - 1 - index}
            key={index}
          />
        ))}
      </MDBRow>
    </MDBCardBody>
  );
};

export default Body;

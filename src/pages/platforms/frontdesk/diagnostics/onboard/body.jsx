import React from "react";
import { useSelector } from "react-redux";
import { MDBTypography, MDBRow } from "mdbreact";
import Card from "./card";

const Body = () => {
  const { collections, isLoading } = useSelector(
    ({ taskGenerator }) => taskGenerator
  );

  console.log("collections", collections);

  return (
    <>
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
    </>
  );
};

export default Body;

import React from "react";
import { MDBIcon } from "mdbreact";
import { currency } from "../../../../../../../../services/utilities";

const Card = ({ isFuture, isLoading, sales, total }) => {
  return (
    <>
      {isFuture ? (
        " "
      ) : isLoading ? (
        <MDBIcon icon="spinner" pulse />
      ) : !sales.length ? (
        <span> </span>
      ) : (
        <>
          <span>{currency(total)}</span>
          <span>Patients - {sales.length}</span>
        </>
      )}
    </>
  );
};

export default Card;

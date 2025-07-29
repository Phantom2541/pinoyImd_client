import { MDBTable, MDBTableHead } from "mdbreact";
import React from "react";
import { useSelector } from "react-redux";

const Body = () => {
  const { filteredStatus } = useSelector(({ validator }) => validator);
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>Branch</tr>
        <tr>Patient</tr>
        <tr>Template/Services</tr>
      </MDBTableHead>
    </MDBTable>
  );
};

export default Body;

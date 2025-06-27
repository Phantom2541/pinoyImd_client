import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(({ machines }) => machines);
    


  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Model</th>
          <th>Brand</th>
          <th>Serial</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, model, brand, serial, status } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td><b>{model}</b></td>
              <td><b>{brand}</b></td>
              <td><b>{serial}</b></td>
              <td><b>{status}</b></td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

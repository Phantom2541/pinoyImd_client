import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName } from "../../../../../services/utilities";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ deals }) => deals);

  useEffect(() => {
    //console.log("Body filtered: ", filtered);
  }, [filtered]);

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Customer</th>
          {/* <th>Cashier</th> */}
          <th>Source</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((service, index) => {
          const {
            customerId,
            cashierId,
            source,
            category,
            amount,
            discount,
            privilege,
            createdAt,
            rendered,
          } = service;

          return (
            <tr key={index}>
              <td>{index + startIndex + 1}</td>
              <td>{fullName(customerId?.fullName)}</td>
              {/* <td>{fullName(cashierId?.fullName)}</td> */}
              <td>{source?.displayname}</td>
              <td>{category}</td>
              <td>{amount}</td>
              <td>{discount}</td>
              <td>{privilege}</td>
              <td>{createdAt}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

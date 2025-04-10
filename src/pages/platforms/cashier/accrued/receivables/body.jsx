import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
    ({ services }) => services
  );

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
          <th>Service</th>
          <th>Abbreviation</th>
          <th>Specimen</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((service, index) => (
          <tr key={index}>
            <td key={index}>{index + startIndex + 1}</td>
            <td>{service.name}</td>
            <td>{service.abbreviation} </td>
            <td>{service.specimen}</td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default Body;

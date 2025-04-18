import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { Policy } from "../../../../../services/fakeDb";

const Body = () => {
  const { collections, activePage, maxPage } = useSelector(
    ({ personnels }) => personnels
  );

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = collections.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>Branch </th>
          <th>Position</th>
          <th title="Status of Employment">SOE</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((app, index) => {
          const { branch = {}, contract = {}, status } = app;
          const { name, companyId } = branch;
          const { soe, designation } = contract;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <h5>{companyId?.name}</h5>
                <small>{companyId?.subName}</small>
              </td>
              <td>{name} </td>
              <td>{Policy.getPosition(designation)}</td>
              <td>{soe}</td>
              <td>{status}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

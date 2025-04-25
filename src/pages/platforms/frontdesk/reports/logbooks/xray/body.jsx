import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { maxPage, activePage } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ xray }) => xray);
  console.log("collections", collections);
  console.log("activePage", activePage);
  console.log("maxPage", maxPage);
  /**
   * Pagination: Calculate the total number of pages
   */

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  // const itemsPerPage = maxPage; // Number of items per page
  // const startIndex = (activePage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const paginatedData = collections.slice(startIndex, endIndex); // Get only items for the active page
  // console.log("paginatedData", paginatedData);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Impression</th>
        </tr>
      </thead>
      <tbody>
        {collections?.map((collection, index) => {
          console.log(collection);

          return (
            <tr key={index}>
              <td key={index}>{index + 1}</td>
              <td>{collection.description}</td>
              <td>{collection.impression} </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

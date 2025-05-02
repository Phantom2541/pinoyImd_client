import React from "react";
import { useSelector } from "react-redux";
import { MDBTable, MDBIcon } from "mdbreact";
import { billingAddress, fullName } from "../../../../../services/utilities";

const Body = () => {
  const { paginated, activePage, maxPage } = useSelector(
    ({ providers }) => providers
  );

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = paginated?.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr className="text-center">
          <th>#</th>
          <th>Name</th>
          <th>A.O.</th>
          <th>Membership</th>
          <th>Address</th>
          <th colSpan="4">Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((provider, index) => {
          const { vendors, membership, ao } = provider,
            { displayname, address } = vendors;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{displayname}</td>
              <td>{fullName(ao.fullName)}</td>
              <td>{membership}</td>
              <td>{billingAddress(address)}</td>
              <td className="text-center" style={{ width: "200px" }}>
                <button className="btn btn-primary rounded">
                  <MDBIcon icon="store-slash" />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

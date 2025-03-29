import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

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
          <th colSpan="4">Hotline</th>
        </tr>
        <tr className="text-center">
          <th colSpan="2"></th>
          <th>Hotline Name</th>
          <th>Contact</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((provider, index) => {
          const { name, subName, hotlineName, contactNumber, description } =
            provider;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {subName ? `${subName}, ` : ""} {name}
              </td>
              <td>{hotlineName || "--"}</td>
              <td>{contactNumber || "--"}</td>
              <td>{description || "--"}</td>
              <td className="text-center" style={{ width: "200px" }}>
                <button className="btn btn-primary rounded">
                  <i className="fas fa-phone-alt"></i> Call
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

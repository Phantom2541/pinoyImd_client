import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import { currency } from "./../../../../../services/utilities";

const Tables = () => {
  const { filtered, activePage, maxPage } = useSelector(({ menus }) => menus);

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
          <th>Name</th>
          <th>Services</th>
          <th>SRP</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((collection, index) => {
          const { description, abbreviation, opd, packages, hasDiscount } =
            collection;
          const services = Services.whereIn(packages);

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <h5>{abbreviation}</h5>
                <small>{description}</small>
              </td>
              <td>
                {services.map((service) => (
                  <h6 key={service.id}>{service.name}</h6>
                ))}
              </td>
              <td>
                <h5>{currency(opd)}</h5>
                <small>{hasDiscount ? "Discountable" : "fixed price"}</small>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Tables;

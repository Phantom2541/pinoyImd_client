import React from "react";
import { Services, Templates } from "../../../../../services/fakeDb";
import { MDBTable, MDBTableBody, MDBTableHead, MDBBadge } from "mdbreact";
const CollapseTable = ({ department }) => {
  const tdStyle = {
    fontWeight: 400,
  };
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Template</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {Services.filterByDepartment(department).map((service, index) => {
          const { name, abbreviation, template = 0 } = service; // Inalis ang duplicate `department`
          return (
            <tr key={service.id || index}>
              <td>{index + 1}</td>
              <td style={tdStyle}>
                {name}
                <MDBBadge color="success" className="ms-3">
                  {abbreviation}
                </MDBBadge>
              </td>
              <td style={tdStyle}>
                {Templates.getTemplate(service.department, template)}
                {/* Gumamit ng service.department */}
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default CollapseTable;

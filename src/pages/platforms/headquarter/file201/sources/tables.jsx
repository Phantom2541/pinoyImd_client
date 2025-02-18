import React from "react";
import { MDBTable, MDBIcon } from "mdbreact";

const Tables = ({ vendors }) => {
  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th rowSpan={2}>Company</th>
          <th rowSpan={2}>Branch</th>
          <th colSpan={2} className="text-center">
            Contact Person
          </th>
          <th rowSpan={2}>Address</th>
          <th className="text-center " rowSpan={2}>
            Action
          </th>
        </tr>
        <tr>
          <th>Mobile</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {vendors?.map((vendor, index) => {
          const { clients } = vendor;
          // Rest of your code here

          return (
            <tr key={index}>
              <td>
                {clients?.companyName} ({name})
              </td>
              <td>
                {clients?.name} ({subName})
              </td>
              <td>{clients?.contacts?.mobile}</td>
              <td>{clients?.contacts?.email}</td>
              <td>{clients?.address?.city}</td>
              <td className="py-2 text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    color="info"
                    rounded
                    title="Update"
                    onClick={() => handleUpdate(vendor)}
                  >
                    <MDBIcon icon="pen" />
                  </MDBBtn>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    rounded
                    color="danger"
                    title="Delete"
                    onClick={() => handleDelete(vendor)}
                  >
                    <MDBIcon icon="trash-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Tables;

import React from "react";
import { MDBTable, MDBIcon } from "mdbreact";

<<<<<<< Updated upstream
=======
//import { DESTROY } from "../../../../../services/redux/slices/assets/persons/source";

>>>>>>> Stashed changes
const Tables = ({ vendors }) => {
  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th className="th-lg cursor-pointer" rowSpan={2}>
            No&nbsp;
            <MDBIcon
              icon="sort"
              title="Sort by Name"
              className="text-primary"
            />
          </th>
          <th rowSpan={2}>Company Name</th>
          <th rowSpan={2}>Branch Name</th>
          <th colSpan={2} className="text-center">
            Contact
          </th>
          <th rowSpan={2}>Address</th>
          <th className="text-center " rowSpan={2}>
            {" "}
            Action
          </th>
        </tr>
        <tr>
          <th>Contact Person</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {vendors?.map((vendor, index) => {
          const { clients } = vendor;
          // Rest of your code here

          return (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{clients?.companyName}</td>
              <td>{clients?.name}</td>
              <td>{clients?.contacts?.mobile}</td>
              <td>{clients?.contacts?.email}</td>
              <td>{clients?.address?.city}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};
export default Tables;

import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  dateFormat,
  fullName,
  getAge,
  getTime,
} from "../../../../../../services/utilities";

const Body = () => {
  const { collections } = useSelector(({ ecg }) => ecg);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Description</th>
          <th>Impression</th>
          <th>Day</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {collections?.map((collection, index) => {
          const { customerId, description, impression, createdAt } = collection;

          return (
            <tr key={index}>
              <td key={index}>{index + 1}</td>
              <td>{fullName(customerId.fullName)}</td>
              <td>{getAge(customerId.dob)}</td>
              <td>{customerId.isMale ? "Male" : "Female"}</td>
              <td>{description}</td>
              <td>{impression} </td>
              <td>{dateFormat(createdAt)}</td>
              <td>{getTime(createdAt)}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

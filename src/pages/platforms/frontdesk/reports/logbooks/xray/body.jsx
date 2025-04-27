import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  fullName,
  getAge,
  getTime,
} from "../../../../../../services/utilities";

const Body = () => {
  const { collections = [] } = useSelector(({ xray }) => xray);

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
        {Array.isArray(collections) &&
          collections?.map((collection, index) => {
            const { customerId, description, impression, createdAt } =
              collection;

            const d = new Date(createdAt),
              day = d.getDate();
            return (
              <tr key={index}>
                <td key={index}>{index + 1}</td>
                <td>{fullName(customerId.fullName)}</td>
                <td>{getAge(customerId.dob)}</td>
                <td>{customerId.isMale ? "Male" : "Female:"}</td>
                <td>{description}</td>
                <td>{impression} </td>
                <td>{day}</td>
                <td>{getTime(createdAt)}</td>
              </tr>
            );
          })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

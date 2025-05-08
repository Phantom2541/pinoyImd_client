import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { collections } = useSelector(({ temperatures }) => temperatures);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Refridge AM</th>
          <th>Refridge PM</th>
          <th>Room AM</th>
          <th>Room PM</th>
        </tr>
      </thead>
      <tbody>
        {collections?.map((temperatrure, index) => {
          // personallized
          const { AM, PM } = temperatrure;

          return (
            <tr key={index}>
              <td key={index}>{index + 1}</td>
              <td>{AM?.room}</td>
              <td>{AM?.ref}</td>
              <td>{PM?.room}</td>
              <td>{PM?.ref}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

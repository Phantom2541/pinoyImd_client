import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mobile } from "../../../../../services/utilities";

const Table = () => {
  const { collections } = useSelector(({ providers }) => providers),
    [hmo, setHmo] = useState([]);

  useEffect(() => {
    setHmo(collections);
  }, [collections]);
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Contact Number</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {hmo.map((data, index) => {
          const { name, address, number } = data;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{mobile(number)}</td>
              <td>{address}</td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn color="danger" size="sm" rounded>
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn color="primary" size="sm" rounded>
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Table;

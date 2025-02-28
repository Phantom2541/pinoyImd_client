import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { fullAddress } from "../../../../../services/utilities";
import Modal from "./modal";
import Headers from "./headers";

export default function Outsource() {
  const [sources, setSources] = useState([]),
    [name, setName] = useState(""),
    [showModal, setShowModal] = useState(false),
    { collections } = useSelector(({ providers }) => providers);

  useEffect(() => {
    setSources(collections);
  }, [collections]);

  const toggle = () => {
    setShowModal(!showModal);
  };

  return (
    <MDBContainer>
      <MDBCard>
        <Headers setName={setName} setShowModal={setShowModal} />
        <MDBCardBody>
          <MDBTable>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {sources.map((source, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {source?.vendors?.companyName}\{source?.vendors?.name}
                    </td>
                    <td>{fullAddress(source?.vendors?.address)}</td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>

      <Modal show={showModal} companyName={name} toggle={toggle} />
    </MDBContainer>
  );
}

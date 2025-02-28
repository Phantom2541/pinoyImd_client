import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import {
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { fullAddress } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import Modal from "./modal";

export default function Outsource() {
  const [sources, setSources] = useState([]),
    [name, setName] = useState(""),
    [showModal, setShowModal] = useState(false),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { clients: activePlatform?.branchId } }));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    setSources(collections);
  }, [collections]);

  const handleTag = async () => {
    const { value: name } = await Swal.fire({
      title: "Input Company name",
      input: "text",
      inputLabel: "Company name",
    });
    //console.log("outside if", name);
    if (name) {
      //console.log("inside if", name);
      setName(name);
      setShowModal(true);
    }
  };
  const toggle = () => {
    setShowModal(!showModal);
  };

  return (
    <MDBContainer>
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between">
          <h2>Outsource </h2>
          <MDBBtn
            type="button"
            color="info"
            rounded
            onClick={() => handleTag()}
          >
            <MDBIcon icon="clinic-medical" />
          </MDBBtn>
        </MDBCardHeader>
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

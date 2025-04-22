import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  OUTSOURCE,
  RESET,
  UPDATE,
} from "../../../../services/redux/slices/assets/providers";
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
import { fullAddress } from "../../../../services/utilities";
import Swal from "sweetalert2";
import Modal from "./modal";

export default function Outsource() {
  const [providers, setProviders] = useState([]),
    [name, setName] = useState(""),
    [showModal, setShowModal] = useState(false),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        OUTSOURCE({ token, key: { clients: activePlatform?.branchId } })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    setProviders(collections);
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
  const handleEdit = async (source) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Provider",
      html: `
      <input 
        id="swal-input1" 
        class="swal2-input" 
        placeholder="Display Name" 
        value="${source?.displayname || ""}"
      >
      <input 
        id="swal-input2" 
        class="swal2-input" 
        placeholder="ABBR" 
        value="${source?.abbr || ""}"
      >
    `,
      focusConfirm: false,
      preConfirm: () => {
        const displayname = document.getElementById("swal-input1").value;
        const abbr = document.getElementById("swal-input2").value;

        if (!displayname || !abbr) {
          Swal.showValidationMessage("Please fill in both fields");
          return false;
        }

        return { displayname, abbr };
      },
    });

    if (formValues) {
      console.log("Edited values:", formValues);
      dispatch(
        UPDATE({
          token,
          data: {
            _id: source._id,
            displayname: formValues.displayname,
            abbr: formValues.abbr,
          },
        })
      );
    }
  };

  return (
    <MDBContainer>
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between">
          <h2>Providers </h2>
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
                <th>Name \ Branch</th>
                <th>Address</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {providers.map((source, index) => {
                console.log("source", source);

                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {source?.vendors?.displayname
                        ? source?.vendors?.displayname
                        : source?.vendors?.companyId?.name}
                      \{source?.vendors ? source?.vendors?.name : ""}
                    </td>
                    <td>{fullAddress(source?.vendors?.address)}</td>
                    <td>
                      <MDBBtn
                        type="button"
                        color="info"
                        rounded
                        onClick={() => handleEdit(source)}
                      >
                        <MDBIcon icon="pencil-alt" />
                      </MDBBtn>
                    </td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>

      <Modal show={showModal} displayname={name} toggle={toggle} />
    </MDBContainer>
  );
}

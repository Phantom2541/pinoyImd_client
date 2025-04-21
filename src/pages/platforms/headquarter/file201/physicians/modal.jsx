import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdbreact";
import Swal from "sweetalert2";
import {
  RESET,
  SAVE,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import {
  getAge,
  getGenderIcon,
  properFullname,
} from "../../../../../services/utilities";
import { BROWSE } from "../../../../../services/redux/slices/assets/persons/users";

export default function Modal({ show, toggle, name }) {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ users }) => users);

  const [users, setUsers] = useState([]);
  // const [doctors, setDoctors] = useState([]);

  // Search by name
  useEffect(() => {
    if (name) {
      const [lname, rest = ""] = name.toUpperCase().split(", ");
      const [fname, mname] = rest?.split(" y ");
      dispatch(BROWSE({ key: { lname, mname, fname }, token }));
    }

    return () => dispatch(RESET());
  }, [name, dispatch, token]);

  // Update users list
  useEffect(() => {
    if (collections) {
      setUsers(collections);
    }
  }, [collections]);

  const handleAddPhysicians = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: `Tag ${properFullname(user.fullName)} as Physician`,
      html: `
      <input id="swal-postnominal" class="swal2-input" placeholder="Post-nominal (e.g., MD)">
      <input id="swal-alias" class="swal2-input" placeholder="Alias">
      <input id="swal-specialization" class="swal2-input" placeholder="Specialization">
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Tag Physician",
      preConfirm: () => {
        const postnominal = document
          .getElementById("swal-postnominal")
          .value.trim();
        const alis = document.getElementById("swal-alias").value.trim();
        const specialization = document
          .getElementById("swal-specialization")
          .value.trim();

        return { postnominal, alis, specialization };
      },
    });

    if (formValues) {
      const payload = {
        user: user._id,
        branch: activePlatform?.branchId,
        status: "active",
        alis: formValues.alis,
        specialization: formValues.specialization,
        ghostName: {
          postnominal: formValues.postnominal,
        },
      };

      // setDoctors((prev) => [...prev, payload]);

      // Save immediately
      dispatch(SAVE({ token, data: [payload] }));

      // Confirmation
      Swal.fire({
        title: "Physician Tagged!",
        text: `${properFullname(user.fullName)} has been successfully tagged.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      toggle();
    }
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="xl">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Tag a Physician
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol md="12">
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>Fullname</th>
                  <th>Age</th>
                  <th>Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => {
                    const { isMale, fullName, dob } = user;
                    return (
                      <tr key={`user-${index}`}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>
                            {getGenderIcon(isMale)}
                            {properFullname(fullName, true).toUpperCase()}
                          </strong>
                        </td>
                        <td>{getAge(dob)}</td>
                        <td>
                          <MDBBtn
                            onClick={() => handleAddPhysicians(user)}
                            size="12px"
                            color="info"
                          >
                            <MDBIcon icon="tag" />
                          </MDBBtn>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No users found.
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}

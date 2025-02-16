import React, { useEffect, useState } from "react";
// useEffect,
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
import { useToasts } from "react-toast-notifications";
import {
  RESET,
  SAVE,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import {
  getAge,
  getGenderIcon,
  // globalSearch,
  properFullname,
} from "../../../../../services/utilities";
import { BROWSE } from "../../../../../services/redux/slices/assets/persons/users";

export default function Modal({ show, toggle, selected, name }) {
  const { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, isLoading, message, isSuccess } = useSelector(
      ({ users }) => users
    ),
    [users, setUsers] = useState([]),
    [doctors, setDoctors] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // dumale, marivel y pedro

  useEffect(() => {
    if (name) {
      const [lname, rest = ""] = name.toUpperCase().split(", "),
        [fname, mname] = rest?.split(" y ");

      dispatch(BROWSE({ key: { lname, mname, fname }, token }));
    }

    return () => dispatch(RESET());
  }, [name, dispatch, token]);
  console.log(collections);

  useEffect(() => {
    if (collections.payload) {
      console.log(collections.payload);
      setUsers(collections.payload);
    }
  }, [collections]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(SAVE({ token, data: doctors }));
    toggle();
  };

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  // const handleSearch = async (willSearch, key) => {
  //   if (willSearch) return setUsers(globalSearch(collections.users, key));

  //   setUsers(collections.users);
  // };

  const handleAddPhysicians = (user) => {
    setDoctors({ user: user._id, branch: onDuty._id, status: "active" });
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      // disableFocusTrap={false}
      size="xl"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        Tag a Physicians
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              {/* <DataTable
                isLoading={isLoading}
                title="users"
                liveSelector={}
                array={users}
                tableHeads={[
                  {
                    _text: "Name",
                  },
                  {
                    _text: "Updated At",
                  },
                  {
                    _text: "Created At",
                  },
                ]}
                tableBodies={[
                  {
                    _key: "fullName",
                    _format: (data) => (
                      <strong>
                        {getGenderIcon(data.isMale)}
                        {String(properFullname(data, true)).toUpperCase()}
                      </strong>
                    ),
                  },
                  {
                    _key: "updatedAt",
                    _format: (data) => new Date(data).toLocaleString(),
                  },
                  {
                    _key: "createdAt",
                    _format: (data) => new Date(data).toLocaleString(),
                  },
                ]}
                handleSearch={handleSearch}
              /> */}
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
                  {users.map((user, index) => {
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
                  })}
                </MDBTableBody>
              </MDBTable>
            </MDBCol>
          </MDBRow>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              submit
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}

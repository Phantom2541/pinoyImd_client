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
import { SAVE } from "../../../../../services/redux/slices/assets/providers";
import { capitalize, fullAddress } from "../../../../../services/utilities";
import {
  VENDORS,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";

export default function Modal({ show, toggle, companyName }) {
  const { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(
      ({ companies }) => companies
    ),
    [companies, setCompanies] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    companyName &&
      dispatch(VENDORS({ token, key: { name: capitalize(companyName) } }));

    return () => dispatch(RESET());
  }, [companyName, dispatch, token]);

  useEffect(() => {
    if (collections.length > 0) {
      setCompanies(collections);
    }
  }, [collections]);

  const handleSubmit = (company) => {
    dispatch(
      SAVE({
        token,
        data: {
          vendors: company._id,
          clients: onDuty._id,
          status: "active",
          name: company.name,
          subName: company.subName,
          ao: company.ao,
          isApproved: true,
        },
      })
    );
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

  console.log(companies);
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
        {capitalize(companyName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBRow>
          <MDBCol md="12">
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>Branch</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {companies.map((company, index) => {
                  const { name, address, contacts, companyId } = company;
                  return (
                    <tr key={`company-${index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <strong>{companyId?.name}</strong>
                        </p>
                        <p>{name}</p>
                      </td>
                      <td>{contacts.email}</td>
                      <td>{capitalize(fullAddress(address))}</td>
                      <td>
                        <MDBBtn
                          onClick={() => handleSubmit(company)}
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
      </MDBModalBody>
    </MDBModal>
  );
}

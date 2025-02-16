import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/assets/persons/applicants";
import { MDBCard, MDBCardBody, MDBTable, MDBTableBody } from "mdbreact";

const Applicants = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ applicants }) => applicants),
    [applicants, setApplicants] = useState([]),
    dispatch = useDispatch();

  console.log(activePlatform);

  useEffect(() => {
    dispatch(BROWSE({ token, branchId: activePlatform.branchId }));
  }, [token, dispatch]);

  useEffect(() => {
    setApplicants(collections);
  }, [collections]);

  console.log(collections);

  return (
    <>
      <MDBCard>
        <MDBCardBody>
          <MDBTable>
            <MDBTableBody>
              {applicants.length > 0 ? (
                applicants.map((applicants) => (
                  <tr key={applicants._id}>
                    <td>{applicants.fullName}</td>
                    <td>{applicants.email}</td>
                    <td>{applicants.phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Applicants</td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default Applicants;

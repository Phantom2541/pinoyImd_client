import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBTable, MDBView } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../services/redux/slices/assets/persons/applicants";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";

export default function Applicants() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess } = useSelector(
      ({ applicants }) => applicants
    ),
    [applicants, setApplicants] = useState([]),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
  }, [isSuccess, message, addToast]);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    setApplicants(collections);
  }, [collections]);

  return (
    <>
      <MDBCard narrow className="pb-3">
        <MDBView
          cascade
          className="gradient-card-header blue-gradient py-2 mx-4 d-flex justify-content-between align-items-center"
        >
          <span className="ml-3">Applicant List</span>
        </MDBView>
        <MDBCardBody>
          <MDBTable responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th className="cursor-pointer">
                  Name&nbsp;
                  <MDBIcon icon="sort" title="Sort by Name" />
                </th>
                <th> Pds</th>
                <th>Resume</th>
                <th>Letter</th>
                <th>By Monthly</th>
              </tr>
            </thead>

            <tbody>
              {applicants.map((applicant, index) => {
                const { _id, user, employment, file201 } = applicant;
                const { hasPds, hasResume, hasLetter } = file201;
                const { biMonthly } = employment;

                return (
                  <tr key={_id}>
                    <td>{index + 1}</td>

                    <td>{fullName(user.fullName)}</td>
                    <td>
                      <MDBIcon
                        icon={hasPds ? "check" : "times"}
                        style={{ color: hasPds ? "green" : "red" }}
                      />
                    </td>
                    <td>
                      <MDBIcon
                        icon={hasResume ? "check" : "times"}
                        style={{ color: hasResume ? "green" : "red" }}
                      />
                    </td>
                    <td>
                      <MDBIcon
                        icon={hasLetter ? "check" : "times"}
                        style={{ color: hasLetter ? "green" : "red" }}
                      />
                    </td>
                    <td>
                      <MDBIcon
                        icon={biMonthly ? "check" : "times"}
                        style={{ color: biMonthly ? "green" : "red" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}

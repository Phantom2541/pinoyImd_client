import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBTable, MDBView } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  SetSELECTED,
} from "../../../../../services/redux/slices/assets/persons/applicants";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";
import Access from "./modal";
import TableLoading from "../../../../../components/tableLoading";
import { Policy } from "../../../../../services/fakeDb";

export default function Applicants() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
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
      dispatch(BROWSE({ token, data: { branchId: activePlatform?.branchId } }));
    }
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    const _collections = [...collections].filter(
      ({ status }) => status === "petition"
    );
    setApplicants(_collections);
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
          {!isLoading ? (
            <MDBTable responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th className="cursor-pointer">
                    Name&nbsp;
                    <MDBIcon icon="sort" title="Sort by Name" />
                  </th>
                  <th>Position</th>
                  <th> PDS</th>
                  <th>Resume</th>
                  <th>Letter</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((applicant, index) => {
                  const {
                    _id,
                    user,
                    file201 = {},
                    contract,
                    remarks,
                  } = applicant;
                  const { hasPds, hasResume, hasLetter } = file201;

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{fullName(user.fullName)}</td>
                      <td>
                        <h6 className="font-weight-bold">
                          {Policy.getPosition(contract?.designation)}
                        </h6>
                        <small
                          style={{ marginTop: "-0.3rem", display: "block" }}
                        >
                          {Policy.getDepartment(contract?.designation)}
                        </small>
                      </td>
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
                      <td>{remarks}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => dispatch(SetSELECTED(applicant))}
                        >
                          <MDBIcon icon="eye" className="mr-1" />
                          Accept
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </MDBTable>
          ) : (
            <TableLoading />
          )}
        </MDBCardBody>
      </MDBCard>
      <Access />
    </>
  );
}

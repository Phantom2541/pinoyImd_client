import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBView,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  SetCREDENTIAL,
  SetSELECTED,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/applicants";
import { BROWSE as BROWSE_BRANCHES } from "../../../../../services/redux/slices/assets/branches";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../services/utilities";
import Access from "./modal";
import TableLoading from "../../../../../components/tableLoading";
import { Policy } from "../../../../../services/fakeDb";
import ViewCredential from "./viewCredential";
import Swal from "sweetalert2";

export default function Applicants() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ applicants }) => applicants
    ),
    [applicants, setApplicants] = useState([]),
    dispatch = useDispatch(),
    { addToast } = useToasts();
  console.log("applicants", applicants);

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
    if (token && activePlatform?.branchId) {
      const { branch = {} } = activePlatform;
      const { companyId = {} } = branch;
      dispatch(BROWSE_BRANCHES({ token, key: { companyId: companyId?._id } }));
    }
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    const _collections = [...collections].filter(
      ({ status }) => status === "petition"
    );
    setApplicants(_collections);
  }, [collections]);

  const handleDeny = (applicant) => {
    Swal.fire({
      html: `
      <h5 style="margin-bottom: 0.5rem;">
        Are you sure you want to deny <strong>${fullName(
          applicant?.user?.fullName
        )}</strong>?
      </h5>
      <p style="font-size: 0.9rem; color: #555;">
        This action is irreversible. Please provide a reason for denying the application.
      </p>
       <label for="swal-input" style="display:block; font-weight: 400; margin-bottom: 0rem;">Reason for denial</label>
    `,
      input: "textarea",
      inputPlaceholder: "Type your reason here...",
      inputAttributes: {
        "aria-label": "Reason for denial",
        id: "swal-input",
      },
      inputValidator: (value) => {
        if (!value?.trim()) {
          return "You must provide a reason before proceeding.";
        }
        return null;
      },
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, deny application",
    }).then((result) => {
      if (result.isConfirmed) {
        const { remarks = [] } = applicant;
        const _remarks = [...remarks];
        _remarks.push({
          title: "Denied",
          reason: result.value,
          createdAt: new Date(),
        });
        dispatch(
          UPDATE({
            token,
            data: { _id: applicant._id, status: "denied", remarks: _remarks },
          })
        ).then(() => {
          Swal.fire({
            icon: "success",
            title: "Application Denied",
            html: `The application of <strong>${fullName(
              applicant?.user?.fullName
            )}</strong> has been denied with the provided reason.`,
          });
        });
      }
    });
  };

  const CredentialChecker = ({ user, type, hasUpload = false }) => {
    return (
      <MDBIcon
        style={{ color: hasUpload ? "green" : "red" }}
        title={hasUpload ? "View Credential" : "No Uploaded Credential"}
        className={hasUpload ? "cursor-pointer" : ""}
        icon={hasUpload ? "eye" : "times"}
        onClick={() =>
          hasUpload
            ? dispatch(SetCREDENTIAL({ user, type }))
            : console.log("no credential")
        }
      />
    );
  };

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
                  <th>PDS</th>
                  <th>Resume</th>
                  <th>Letter</th>
                  <th>Remarks</th>
                  <th className="text-center">Actions</th>
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
                        <CredentialChecker
                          hasUpload={hasPds}
                          user={user}
                          type="DataSheet"
                        />
                      </td>
                      <td>
                        <CredentialChecker
                          hasUpload={hasResume}
                          user={user}
                          type="Resume"
                        />
                      </td>
                      <td>
                        <CredentialChecker
                          hasUpload={hasLetter}
                          user={user}
                          type="AppLetter"
                        />
                      </td>
                      <td>{remarks}</td>
                      <td className="text-center">
                        <MDBBtnGroup>
                          <MDBBtn
                            rounded
                            size="sm"
                            color="danger"
                            onClick={() => handleDeny(applicant)}
                          >
                            <MDBIcon icon="user-times" className="mr-2" />
                            Deny
                          </MDBBtn>
                          <MDBBtn
                            rounded
                            size="sm"
                            color="primary"
                            onClick={() => dispatch(SetSELECTED(applicant))}
                          >
                            <MDBIcon icon="user-check" className="mr-2" />
                            Accept
                          </MDBBtn>
                        </MDBBtnGroup>
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
      <ViewCredential />
    </>
  );
}

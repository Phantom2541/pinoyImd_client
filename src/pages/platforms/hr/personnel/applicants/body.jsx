import { MDBTable, MDBBtnGroup, MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  SetCREDENTIAL,
  SetSELECTED,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/applicants";
import { Policy } from "../../../../../services/fakeDb";
import EditableSelect from "../../../../../components/customizable/editableSelect";
import Swal from "sweetalert2";
import { fullName } from "../../../../../services/utilities";

const Body = ({ applicants }) => {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ applicants }) => applicants),
    { collections: branches } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();

  const getApplicantRemarks = (applicant = {}) => {
    if (applicant?.message) return applicant.message;

    const remarks = Array.isArray(applicant?.remarks) ? applicant.remarks : [];
    return remarks[remarks.length - 1]?.reason || "";
  };

  const handleDeny = (applicant) => {
    Swal.fire({
      title: "Confirm Denial",
      html: `Are you certain you want to deny the application of <strong>${fullName(
        applicant?.user?.fullName
      )}</strong>? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, deny application",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: {
              _id: applicant._id,
              status: "denied",
            },
          })
        ).then(() => {
          Swal.fire({
            title: "Application Denied",
            html: `The application of <strong>${fullName(
              applicant?.user?.fullName
            )}</strong> has been successfully denied.`,
            icon: "success",
          });
        });
      }
    });
  };

  const handleUpdateBranch = (fieldData) => {
    dispatch(UPDATE({ token, data: fieldData }));
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
    <MDBTable responsive hover>
      <thead>
        <tr>
          <th>#</th>
          <th className="cursor-pointer">
            Name&nbsp;
            <MDBIcon icon="sort" title="Sort by Name" />
          </th>
          <th>Position</th>
          <th>Branch</th>
          <th>PDS</th>
          <th>Resume</th>
          <th>Letter</th>
          <th>Remarks</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {applicants?.length > 0 ? (
          applicants.map((applicant, index) => {
            const {
              _id,
              user,
              file201 = {},
              contract,
              branch,
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
                  <small style={{ marginTop: "-0.3rem", display: "block" }}>
                    {Policy.getDepartment(contract?.designation)}
                  </small>
                </td>
                <td>
                  <EditableSelect
                    isEditable={true}
                    animation
                    animationStyle={{ width: "15rem" }}
                    keyForText={"name"}
                    keyForValue={"branch"}
                    preValue={branch?._id}
                    className="m-0 p-0 mb-n2 mt-n2"
                    collections={branches.map(({ name, _id }) => ({
                      name,
                      branch: _id,
                    }))}
                    fieldData={{
                      branch: branch._id,
                      name: branch.name,
                      _id: _id,
                    }}
                    onSave={(fieldData) => handleUpdateBranch(fieldData)}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
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
                <td>{getApplicantRemarks(applicant)}</td>
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
          })
        ) : (
          <tr>
            <td colSpan={9} className="text-center text-muted py-4">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <MDBIcon icon="user-slash" size="2x" className="mb-2" />
                <span className="fw-bold">No Applicants Yet</span>
                <small className="text-muted">Check back later</small>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
};

export default Body;

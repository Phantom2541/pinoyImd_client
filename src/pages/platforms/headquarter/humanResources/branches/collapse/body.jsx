import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBBtn,
  MDBIcon,
} from "mdbreact";
import { fullName } from "../../../../../../services/utilities";
import { Policy } from "../../../../../../services/fakeDb";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  ASSIGN_AO,
  UNTAG_PERSONNEL,
  RESET,
} from "../../../../../../services/redux/slices/assets/branches";

export default function Collapsable({ branch = {} }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    { personnels = [], ao = "" } = branch,
    dispatch = useDispatch();

  let filteredPersonnels = personnels
    .filter((p) => p.status?.toLowerCase() === "active")
    .sort((a, b) => {
      if (a.user?._id === ao) return -1; // AO first
      if (b.user?._id === ao) return 1;
      return 0; // keep relative order of others
    });

  // const
  const style = {
    border: "black !important",
    borderLeft: "black",
  };

  const handleAssignAO = (personnel) => {
    const { user } = personnel;
    const message = ao
      ? `There is already an Administrative Officer assigned. Are you sure you want to replace them with  ${fullName(
          user?.fullName
        )}?`
      : `Do you want to assign ${fullName(
          user?.fullName
        )} as the Administrative Officer?`;

    Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: ao ? "Yes, replace AO" : "Yes, assign",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Assigned!",
          text: ` ${fullName(
            user?.fullName
          )} has been successfully assigned as the Administrative Officer.`,
          icon: "success",
        });

        dispatch(
          ASSIGN_AO({
            token,
            data: {
              userId: user._id,
              branchId: branch._id,
              existingAo: ao,
              authID: auth._id,
              newPersonnel: false,
            },
          })
        );

        dispatch(RESET());
      }
    });
  };

  const handleUntag = (personnel) => {
    const { user } = personnel;
    Swal.fire({
      title: "Are you sure?",
      text: `${fullName(
        user.fullName
      )} will be untagged and removed from the personnel list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, untag",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UNTAG_PERSONNEL({
            token,
            data: {
              branchId: branch._id,
              userId: user._id,
              personnelID: personnel._id,
            },
          })
        );
        dispatch(RESET());
        Swal.fire({
          title: "Untagged!",
          text: `${fullName(
            user.fullName
          )}The user has been successfully untagged.`,
          icon: "success",
        });
      }
    });
  };

  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th style={style}>Name</th>
          <th style={style}>Designation</th>
          <th style={style}>Email </th>
          <th>Action</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {filteredPersonnels.length > 0 ? (
          filteredPersonnels?.map((personnel, index) => {
            const { user = {}, contract = { designation: -1 } } =
              personnel || {};

            const isAO = branch?.ao === user?._id;
            return (
              <tr key={index} style={style}>
                <td style={style}>
                  {index + 1}. {fullName(user?.fullName)}
                  {isAO && (
                    <MDBBadge
                      color="primary"
                      className="ml-2"
                      pill
                      title="Administrative Officer"
                    >
                      AO
                    </MDBBadge>
                  )}
                </td>
                <td style={style}>
                  {Policy.getPositions(contract?.designation)}
                </td>
                <td style={style}>{user?.email}</td>
                {/* 👩‍💼 */}
                <td>
                  {!isAO && (
                    <MDBBtn
                      size="sm"
                      onClick={() => handleAssignAO(personnel)}
                      rounded
                      color="light"
                      className="m-0 p-0"
                      title="Assign for administrative officer"
                    >
                      <span style={{ fontSize: "1.3rem" }}>👨‍💼</span>
                    </MDBBtn>
                  )}
                  <MDBBtn
                    size="sm"
                    rounded
                    color="danger"
                    className="px-2"
                    title="Untag Applicant"
                    onClick={() => handleUntag(personnel)}
                  >
                    <MDBIcon icon="user-times" />
                  </MDBBtn>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-6 bg-gray-50">
              <div className="flex flex-col items-center justify-center space-y-2">
                <MDBIcon
                  fas
                  icon="user-slash"
                  size="2x"
                  className="grey-text"
                />
                <h6 className="grey-text italic mt-2">No Personnel</h6>
              </div>
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
}

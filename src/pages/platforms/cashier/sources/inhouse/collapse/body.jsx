import {
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import {
  capitalize,
  fullName,
  getPhysicianGenderIcon,
} from "../../../../../../services/utilities";
import Swal from "sweetalert2";
import {
  CHANGE_MAIN,
  UNTAG,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import {
  SetAFFILIATED,
  SetAFFILIATED_MAIN,
} from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";
import findCurrentMain from "./findCurrentMain";

const Body = ({ branch = {} }) => {
  const { token } = useSelector(({ auth }) => auth);
  const { collections = [] } = useSelector(({ branches }) => branches);
  const { affiliated = [], name = "", displayname = "" } = branch;
  const dispatch = useDispatch();
  const branchName = name || displayname;

  const handleUntag = (physician) => {
    Swal.fire({
      title: "Are you sure?",
      html: `
      <p>
        Are you sure you want to <b>remove</b> 
        <span style="color:#1266f1;font-weight:bold;">
          ${fullName(physician.user.fullName)}
        </span> 
        from  
        <span style="color:#d63384;font-weight:bold;">
          ${capitalize(branchName)}
        </span>?
      </p>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UNTAG({
            token,
            data: {
              branch: branch._id,
              _id: physician._id,
              user: physician?.user?._id,
            },
          })
        ).then((action) => {
          dispatch(
            SetAFFILIATED({
              branchID: branch._id,
              physican: action?.payload?.payload,
              isNew: false,
            })
          );
        });
        Swal.fire(
          "Removed!",
          `${fullName(
            physician.user.fullName
          )} has been untagged from ${capitalize(branchName)}.`,
          "success"
        );
      }
    });
  };

  const handleSetMain = (physician) => {
    // Hanapin kung may current main branch na naka-assign
    const { found, currentMain } = findCurrentMain(
      collections,
      physician?.user
    );

    let htmlMessage = `
    <p style="font-size:16px; margin-bottom:10px;">
      Are you sure you want to set 
      <b style="color:#1266f1;">${capitalize(branchName)}</b> 
      as the <b>main branch</b> of physician 
      <b style="color:#1266f1;">${fullName(physician.user.fullName)}</b>?
    </p>
  `;

    if (found?._id && currentMain?._id) {
      const currentBranch = currentMain?.name || currentMain?.displayname;
      htmlMessage += `
      <p style="margin-top:15px; font-size:14px; color:#555;">
        Current main branch: 
        <b style="color:#d63384;">${capitalize(currentBranch)}</b>
      </p>
    `;
    }

    Swal.fire({
      title: "Confirm Action",
      html: htmlMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, set as main branch",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1266f1",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          CHANGE_MAIN({
            token,
            data: {
              _id: physician._id,
              user: physician?.user?._id,
              mainBranch: currentMain?._id,
            },
          })
        ).then((action) => {
          dispatch(
            SetAFFILIATED_MAIN({
              branchID: branch?._id,
              physician: action?.payload?.payload,
              currentMainBranch: currentMain?._id || "",
            })
          );
        });
      }
    });
  };
  return (
    <MDBTable small>
      <MDBTableHead>
        <th>#</th>
        <th>Name</th>
        <th>Specialization</th>
        <th>Action</th>
      </MDBTableHead>
      <MDBTableBody>
        {affiliated.length > 0 ? (
          affiliated.map((aff, index) => {
            const { isMajor = false } = aff;
            return (
              <tr key={index}>
                <td>{++index}</td>
                <td style={{ fontWeight: 500 }}>
                  {getPhysicianGenderIcon(aff?.user.isMale)}{" "}
                  {fullName(aff?.user.fullName)}
                  <span className="text-primary">
                    {" "}
                    {isMajor ? "(Main Branch)" : ""}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{aff?.specialization}</td>
                <td>
                  <MDBBtnGroup>
                    {!isMajor && (
                      <MDBBtn
                        size="sm"
                        color="info"
                        onClick={() => handleSetMain(aff)}
                        rounded
                        title="Set this branch as the physician's main branch"
                      >
                        <MDBIcon icon="home" />
                      </MDBBtn>
                    )}
                    <MDBBtn
                      size="sm"
                      color="danger"
                      rounded
                      onClick={() => handleUntag(aff)}
                      title="Remove for this branch"
                    >
                      <MDBIcon icon="user-times" />
                    </MDBBtn>
                  </MDBBtnGroup>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              <div className="d-flex flex-column align-items-center justify-content-center grey-text">
                <MDBIcon icon="user-slash" size="2x" className="mb-2" />
                <span className="fw-bold">No Physicians Yet</span>
                <small className="text-muted">
                  Search and add physicians here
                </small>
              </div>
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;

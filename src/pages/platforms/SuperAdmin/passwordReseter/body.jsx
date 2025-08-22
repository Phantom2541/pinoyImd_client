import {
  MDBBtn,
  MDBCardBody,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../services/utilities";
import Swal from "sweetalert2";
import { RESET_PASSWORD } from "../../../../services/redux/slices/assets/persons/users";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections = [] } = useSelector(({ users }) => users),
    dispatch = useDispatch();
  const handleReset = (user) => {
    Swal.fire({
      title: "Reset Password?",
      html: `Are you sure you want to reset the password of 
    <b>${fullName(user.fullName)}</b>?<br><br>
    The new password will be in the format 
    <b>yyyymmdd</b>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          RESET_PASSWORD({
            token,
            data: { _id: user._id, password: user.dob?.replaceAll("-", "") },
          })
        );
      }
    });
  };
  return (
    <MDBCardBody>
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {collections.length > 0 ? (
            collections.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: 500 }}>
                  {getGenderIcon(item.isMale)} {fullName(item.fullName)} |
                  <span className="ml-1">{getAge(item.dob)}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{item.email}</td>
                <td>
                  <MDBBtn
                    size="sm"
                    color="danger"
                    rounded
                    onClick={() => handleReset(item)}
                  >
                    <MDBIcon icon="sync" />
                  </MDBBtn>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-12">
                <div className="flex flex-col items-center justify-center p-8 bg-white">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <MDBIcon
                      fas
                      icon="user-slash"
                      size="2x"
                      className="text-red-500"
                    />
                  </div>

                  <h4 className="font-semibold text-xl mb-2 text-gray-700">
                    No Users Found
                  </h4>
                  <p className="text-sm text-gray-500 max-w-sm mb-4">
                    We couldn’t find any users that match your search. Try again
                    with different keywords.
                  </p>

                  <div className="text-xs text-gray-600 px-4 py-2 rounded-md bg-gray-50">
                    <span className="block mb-1 font-medium">
                      🔎 Search format:
                    </span>
                    <span className="italic text-gray-500 fw-bold ml-1">
                      First Name, Last Name, Middle Name
                    </span>
                    <br />
                    or{" "}
                    <span className="italic text-gray-500 fw-bold">
                      Email Address
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default Body;

import { useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useDispatch } from "react-redux";
import { HMO } from "../../../../../services/fakeDb";
import { mobile } from "../../../../../services/utilities";
import { UPDATE } from "../../../../../services/redux/slices/assets/companies";
import Swal from "sweetalert2";
const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ companies }) => companies
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleRemoved = (code) => {
    const newHO = filtered.filter((item) => item.code !== code);
    Swal.fire({
      title: `are you sure to remove this ${HMO.getName(code)}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed)
        dispatch(
          UPDATE({
            data: { _id: activePlatform.branch.companyId._id, hmo: newHO },
            token,
          })
        );
    });

    // // Check if object has changed
    // if (isEqual(form, selected)) {
    //   return addToast("No changes found, skipping update.", {
    //     appearance: "info",
    //   });
    // }
  };
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Contact Person</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {paginatedData.map((data, index) => {
          const { code, cp } = data;
          const { phone, email, agent } = cp;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{HMO.getName(code)}</td>
              <td>{mobile(phone)}</td>
              <td>{email}</td>
              <td>{agent}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoved(code)}
                >
                  Remove
                </button>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup, MDBBadge } from "mdbreact";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (utilities) => {
    dispatch(SetSELECTED(utilities)); // Dispatch to redux
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th className="text-center">Billing Day</th>
          <th className="text-center">Due Date</th>
          <th>Number</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((utilities, index) => {
          const { _id, displayname, cutoff, abbr, number, address, due } =
            utilities;
          return (
            <tr key={`${index}-${_id}`}>
              <td>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname}</div>
                <div className="text">
                  {abbr ? (
                    // If not editing, show the abbreviation as a badge
                    <MDBBadge
                      title="Click me to update"
                      className="cursor-pointer"
                    >
                      {abbr}
                    </MDBBadge>
                  ) : (
                    <p className="mb-0">No abbreviation</p>
                  )}
                </div>
              </td>
              <td className="text-center" style={{ fontWeight: 400 }}>
                {cutoff}
              </td>
              <td className="text-center" style={{ fontWeight: 400 }}>
                {due}
              </td>
              <td>{number} </td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(utilities)} // Ensure setSelected is used
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(utilities._id)}
                    size="sm"
                    rounded
                    color="danger"
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

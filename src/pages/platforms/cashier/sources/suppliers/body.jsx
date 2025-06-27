import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup, MDBBadge } from "mdbreact";
// import { Input } from "../../../../../components/customizable";

import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import Swal from "sweetalert2";
import { mobile } from "../../../../../services/utilities";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, formSubmitted, isSuccess } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (supplier) => {
    dispatch(SetSELECTED(supplier));
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

  /**
   * Pagination: Calculate the start and end index for the current page
   */
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
          <th>Mobile</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((supplier, index) => {
          const { _id, displayname, name, abbr, number, address } = supplier;

          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname || name}</div>

                <div className="text-muted">
                  {abbr ? (
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
              <td>{mobile(number)}</td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(supplier)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(supplier._id)}
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

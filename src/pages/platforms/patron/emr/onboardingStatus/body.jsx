import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import Swal from "sweetalert2";

const Body = () => {
  const {
      filtered = [],
      activePage,
      maxPage,
      isSuccess,
    } = useSelector(({ onBoardings }) => onBoardings),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage; // Get only items for the active page
  const paginatedData = Array.isArray(filtered)
    ? filtered.slice(startIndex, endIndex)
    : [];

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
      // dispatch(DESTROY({ token, data: { _id  } }));
    });
  };
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Branch</th>
          <th>Specimen</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id, name, abbreviation, specimen } = item;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>

              <td>{specimen}</td>
              <td>
                {/* <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => dispatch(RESET(id))}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => dispatch(SetEDIT(item))}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup> */}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;

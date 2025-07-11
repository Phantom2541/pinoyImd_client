import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { HMO } from "../../../../../services/fakeDb";
import "./style.css";
import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const data = filtered?.payload || []; // ✅ safely get the array
  const paginatedData = data.slice(startIndex, endIndex);

  // const handleDelete = (_id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then((result) => {
  //     dispatch(DESTROY({ token, data: { _id  } }));
  //   });
  // };

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Company</th>
          <th>Cards</th>
          <th>Schedule</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, requirements, schedule, status } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>{HMO.getName(requirements?.hmo)}</td>
              <td>{schedule}</td>
              <td
                className="d-flex align-items-center"
                style={{ textTransform: "capitalize" }}
              >
                {status}
                <span
                  className={`status-dot status-${status}`}
                  style={{ marginLeft: "0.5rem" }}
                ></span>
              </td>
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

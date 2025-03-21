import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import {
  SetPAYMENTS,
  DESTROY,
} from "../../../../../services/redux/slices/finance/journals/payables";
import { Statements } from "../../../../../services/fakeDb";
import { fullName } from "../../../../../services/utilities";
import Swal from "sweetalert2";

const Tables = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage } = useSelector(
    ({ payables }) => payables
  );
  const dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

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
        dispatch(
          DESTROY({
            token,
            data: { _id, branch: activePlatform.branchId, user: auth._id },
          })
        );
      }
    });
  };

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th rowSpan={2}>#</th>
          <th rowSpan={2}>Particular</th>
          <th rowSpan={2}>Statement</th>
          <th colSpan={2} style={{ textAlign: "center" }}>
            Range
          </th>
          <th rowSpan={2}>Due Date</th>
          <th rowSpan={2}>Amount</th>
          <th rowSpan={2} style={{ textAlign: "center" }}>
            Actions
          </th>
        </tr>
        <tr>
          <th>Start</th>
          <th>End</th>
        </tr>
      </thead>
      <tbody>
        {!paginatedData.length && (
          <tr>
            <td colSpan={8} style={{ textAlign: "center" }}>
              No Data
            </td>
          </tr>
        )}
        {paginatedData.map((payable, index) => {
          const {
            _id,
            fsId,
            range = [],
            amount,
            particular,
            due,
            supplier,
          } = payable;
          const [start, end] = range;
          const dueDate = due ? new Date(due) : null;
          const today = new Date();
          const isToday = dueDate?.toDateString() === today.toDateString();
          const isPastDue = dueDate && dueDate < today;

          return (
            <tr
              key={_id}
              style={isPastDue ? { backgroundColor: "#ffcccc" } : {}}
            >
              <td>{index + 1}</td>
              <td>
                {particular?.fullName ? fullName(particular.fullName) : ""}
                {supplier ? ` ${supplier.name} - ${supplier.subname}` : ""}
              </td>
              <td>{Statements?.getName(fsId)}</td>
              <td>
                {start
                  ? new Date(start).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </td>
              <td>
                {end
                  ? new Date(end).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </td>
              <td
                style={{
                  color: isToday ? "orange" : isPastDue ? "red" : "black",
                  fontWeight: isPastDue ? "bold" : "normal",
                }}
              >
                {dueDate
                  ? dueDate.toLocaleDateString("en-GB", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </td>
              <th>{amount}</th>
              <td style={{ textAlign: "center" }}>
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="success"
                    onClick={() => dispatch(SetPAYMENTS(payable))}
                    style={{ marginRight: "20px", borderRadius: "50px" }}
                  >
                    Pay
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="danger"
                    onClick={() => handleDelete(_id)}
                    style={{ borderRadius: "50px" }}
                  >
                    Update
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

export default Tables;

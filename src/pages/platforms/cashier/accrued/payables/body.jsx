import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import {
  SetPAYMENTS,
  DESTROY,
} from "../../../../../services/redux/slices/finance/journals/payables";
import { Statements } from "../../../../../services/fakeDb";
import {
  currency,
  dateFormat,
  fullName,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
import TableLoading from "../../../../../components/tableLoading";

const Tables = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage, isLoading } = useSelector(
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
    <>
      {/* <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th rowSpan={2}>#</th>
          <th rowSpan={2}>Particular/Vendor</th>
          <th rowSpan={2}>Statement</th>
          <th rowSpan={2}>Due Date</th>
          <th rowSpan={2}>Amount</th>
          <th rowSpan={2} style={{ textAlign: "center" }}>
            Actions
          </th>
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
            amount,
            particular,
            due,
            supplier,
            hasPaid,
            payor,
          } = payable;
          const dueDate = due ? new Date(due) : null;
          const today = new Date();
          const isToday = dueDate?.toDateString() === today.toDateString();
          const isPastDue = dueDate && dueDate < today;

          return (
            <tr
              key={_id}
              style={
                isPastDue && !hasPaid ? { backgroundColor: "#ffcccc" } : {}
              }
            >
              <td>{index + 1}</td>
              <td>
                {particular && fullName(particular)}
                {supplier &&
                  (supplier.vendors?.length > 0
                    ? `${supplier.vendors.name} - ${supplier.vendors.subname}`
                    : `${supplier.name} - ${supplier.subname}`)}
              </td>
              <td>{Statements?.getName(fsId)}</td>
              <td
                style={{
                  color: !hasPaid
                    ? isToday
                      ? "orange"
                      : isPastDue
                      ? "red"
                      : "black"
                    : "black",
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
              <th>{currency(amount)}</th>
              <td style={{ textAlign: "center" }}>
                {!hasPaid && (
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
                    {!isPastDue && (
                      <MDBBtn
                        size="sm"
                        rounded
                        color="danger"
                        onClick={() => handleDelete(_id)}
                        style={{ borderRadius: "50px" }}
                      >
                        Update
                      </MDBBtn>
                    )}
                  </MDBBtnGroup>
                )}
                {hasPaid && <span>Payor : {fullName(payor?.fullName)}</span>}
              </td> */}
      {!isLoading ? (
        <MDBTable responsive hover bordered>
          <thead>
            <tr>
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
            {!paginatedData?.length && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No Data
                </td>
              </tr>
            )}
            {paginatedData?.map((payable, index) => {
              const {
                _id,
                fsId,
                range = [],
                amount,
                particular,
                due,
                supplier,
              } = payable;
              const [start = "", end = ""] = Array.isArray(range) ? range : [];
              return (
                <tr key={index}>
                  <td>
                    {particular && fullName(particular.fullName)}
                    {supplier && supplier.name}
                  </td>
                  <td>{Statements?.getName(fsId)}</td>
                  <td>{start ? dateFormat(start) : ""}</td>
                  <td>{end ? dateFormat(end) : ""}</td>
                  <td>{due ? dateFormat(due) : ""}</td>
                  <th>{currency(amount)}</th>
                  <td style={{ textAlign: "center" }}>
                    <MDBBtnGroup>
                      <MDBBtn
                        size="sm"
                        rounded
                        color="success"
                        onClick={() => dispatch(SetPAYMENTS(payable))}
                      >
                        Pay
                      </MDBBtn>
                      <MDBBtn
                        size="sm"
                        rounded
                        color="danger"
                        onClick={() => handleDelete(_id)}
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
      ) : (
        <TableLoading />
      )}
    </>
  );
};

export default Tables;

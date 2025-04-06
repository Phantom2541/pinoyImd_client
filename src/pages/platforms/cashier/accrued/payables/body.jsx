import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import {
  SetPAYMENTS,
  SetUpdate,
} from "../../../../../services/redux/slices/finance/journals/payables";
import { Statements } from "../../../../../services/fakeDb";
import {
  currency,
  dateFormat,
  fullName,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
import util from "./util";
import TableLoading from "../../../../../components/tableLoading";

const Tables = () => {
  const { filtered, activePage, maxPage, isLoading } = useSelector(
    ({ payables }) => payables
  );
  const dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const handleUpdate = (payable) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this provider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(SetUpdate(payable));
      }
    });
  };

  return (
    <>
      {!isLoading ? (
        <MDBTable responsive hover bordered>
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
              const isToday =
                dueDate?.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
              const isPastDue = dueDate && dueDate > today;

              return (
                <tr
                  key={_id}
                  style={
                    isPastDue && !hasPaid ? { backgroundColor: "#ffcccc" } : {}
                  }
                >
                  <td>{index + 1}</td>
                  <td>{util.getVendorOrParticular(particular, supplier)}</td>
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
                    {dueDate ? dateFormat(dueDate) : ""}
                  </td>
                  <th>{currency(amount)}</th>

                  <td style={{ textAlign: "center" }}>
                    {!hasPaid && (
                      <MDBBtnGroup>
                        <MDBBtn
                          size="sm"
                          rounded
                          color="warning"
                          onClick={() => dispatch(SetPAYMENTS(payable))}
                        >
                          Pay
                        </MDBBtn>
                        {!isPastDue && (
                          <MDBBtn
                            size="sm"
                            rounded
                            color="info"
                            onClick={() => handleUpdate(payable)}
                          >
                            Update
                          </MDBBtn>
                        )}
                      </MDBBtnGroup>
                    )}
                    {hasPaid && (
                      <span>Payor : {fullName(payor?.fullName)}</span>
                    )}
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

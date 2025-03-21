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

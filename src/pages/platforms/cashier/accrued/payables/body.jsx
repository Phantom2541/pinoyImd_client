import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn, MDBBadge } from "mdbreact";
import {
  SetPAYMENTS,
  SetUpdate,
} from "../../../../../services/redux/slices/finance/journals/payables";
import { Statements } from "../../../../../services/fakeDb";
import {
  currency,
  dateFormat,
  fullName,
  getTime,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
import util from "./util";
import TableLoading from "../../../../../components/tableLoading";
import { capitalize, isEmpty } from "lodash";
import Deals from "./deals";

const Tables = () => {
  const { filtered, activePage, maxPage, isLoading } = useSelector(
      ({ payables }) => payables
    ),
    [activeId, setActiveId] = useState(-1),
    dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const handleUpdate = (payable) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this Payables?",
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
        <MDBTable responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Received By: </th>
              <th>Particular/Vendor</th>
              <th>Statement</th>
              <th>Due Date</th>
              <th>Remarks</th>
              <th style={{ textAlign: "center" }}>Actions</th>
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
                deals = [],
                particular,
                due,
                supplier,
                hasPaid,
                payor,
                range,
                receiveBy,
                status,
                createdAt,
              } = payable;
              const dueDate = due ? new Date(due) : null;
              const today = new Date();
              const isToday =
                dueDate?.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
              const isPastDue = dueDate && dueDate < today;
              const hasDeals =
                status !== "accepted" && fsId === 31 && !isEmpty(deals);
              const isOpen = activeId === _id;

              return (
                <>
                  <tr
                    className={isOpen && "border border-black"}
                    key={_id}
                    style={
                      isPastDue && !hasPaid
                        ? { backgroundColor: "#ffcccc" }
                        : {}
                    }
                  >
                    <td>{index + 1}</td>
                    <td>
                      <h6>{fullName(receiveBy?.fullName)} </h6>
                      <small style={{ color: "blue" }}>
                        {getTime(createdAt)}
                      </small>
                    </td>
                    <td>
                      <h6>
                        {" "}
                        {util.getVendorOrParticular(particular, supplier)}
                      </h6>
                      <small style={{ color: "blue" }}>
                        {currency(amount)}
                      </small>
                    </td>
                    <td>
                      <h6>{Statements?.getName(fsId)}</h6>
                      <MDBBadge> {capitalize(status)}</MDBBadge>
                    </td>
                    <td>
                      <h6
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
                        {dueDate && dateFormat(dueDate)}
                      </h6>
                      {fsId === 31 && range && (
                        <span>
                          {range[0] &&
                            new Date(range[0]).toLocaleDateString("en-GB", {
                              month: "long",
                              day: "2-digit",
                            })}
                          {" - "}
                          {range[1] &&
                            new Date(range[1]).toLocaleDateString("en-GB", {
                              month: "long",
                              day: "2-digit",
                            })}
                        </span>
                      )}
                    </td>
                    <th>{payable.remarks} </th>
                    <td style={{ textAlign: "center" }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div></div>
                        {!hasPaid &&
                          (fsId === 31 && status === "accepted" ? (
                            <span style={{ color: "green" }}>
                              Double-check all your Sendout Information before
                              confirming the payments.
                            </span>
                          ) : (
                            <MDBBtnGroup>
                              <MDBBtn
                                size="sm"
                                rounded
                                color="warning"
                                onClick={() => dispatch(SetPAYMENTS(payable))}
                              >
                                Pay
                              </MDBBtn>
                              {!isPastDue && status === "accepted" && (
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
                          ))}
                        {hasPaid && (
                          <span>Payor : {fullName(payor?.fullName)}</span>
                        )}
                        {hasDeals ? (
                          <MDBBtn
                            size="sm"
                            color="white"
                            rounded
                            title="View Deals"
                            onClick={() =>
                              setActiveId((prev) => (prev === _id ? -1 : _id))
                            }
                            className="m-0 p-0 transition-all float-right "
                            style={{
                              width: isOpen ? "1.5rem" : "2rem",
                              height: isOpen ? "1.5rem" : "1.3rem",
                            }}
                          >
                            <i
                              style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                              className="fa fa-angle-down transition-all "
                            />
                          </MDBBtn>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {hasDeals && (
                    <Deals deals={deals} isOpen={isOpen} _id={_id} />
                  )}
                </>
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

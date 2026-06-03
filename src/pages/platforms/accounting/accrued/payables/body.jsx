import { useState } from "react";
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
import Deals from "./deals";
import { isEmpty } from "lodash";

const Tables = () => {
  const { filtered, activePage, maxPage, isLoading } = useSelector(
      ({ payables }) => payables,
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
                onboardings,
                range,
                status,
              } = payable;
              const dueDate = due ? new Date(due) : null;
              const today = new Date();
              const isToday =
                dueDate?.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
              const isPastDue = dueDate && dueDate < today;
              const isOpen = activeId === _id;
              const hasDeals =
                status !== "accepted" && fsId === 31 && !isEmpty(onboardings);

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
                    <td style={{ fontWeight: 400 }}>
                      {util.getVendorOrParticular(particular, supplier)}
                    </td>
                    <td>
                      <h6>{Statements?.getName(fsId)}</h6>
                      {status}
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
                    <th>{currency.format(amount)}</th>

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
                          <div className="m-0 p-0 d-flex align-items-center">
                            <MDBBtn
                              size="sm"
                              color="white"
                              rounded
                              title="View Sendouts"
                              onClick={() =>
                                setActiveId((prev) => (prev === _id ? -1 : _id))
                              }
                              className="m-0 p-0 transition-all float-right "
                              style={{
                                width: isOpen ? "1.5rem" : "2.5rem",
                                height: isOpen ? "2rem" : "1.5rem",
                              }}
                            >
                              <i
                                style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                                className="fa fa-angle-down transition-all "
                              />
                            </MDBBtn>
                            {!isOpen && hasDeals && (
                              <span
                                className="counter"
                                style={{
                                  marginBottom: "-10px",
                                  marginRight: "-10px !important",
                                }}
                              >
                                {onboardings?.length}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {hasDeals && (
                    <Deals deals={onboardings} isOpen={isOpen} _id={_id} />
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

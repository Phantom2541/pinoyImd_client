import { useSelector } from "react-redux";
import { MDBBadge, MDBBtn, MDBIcon, MDBTable, MDBTypography } from "mdbreact";
import { dateFormat, fullName } from "../../../../../services/utilities";
import { Services } from "../../../../../services/fakeDb";
import React, { useEffect, useRef, useState } from "react";
import { capitalize } from "lodash";
import Task from "./task";

const Body = () => {
  const { filtered, vendorId } = useSelector(({ onBoardings }) => onBoardings);
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { department } = activePlatform;
  const [activeId, setActiveId] = useState(-1);

  const endOfTableRef = useRef(null); // 👈 Step 1: create ref

  const handlePrint = (item) => {
    const { vendor, services: servicesIDS } = item;
    const services = Services.whereIn(servicesIDS);
    localStorage.setItem(
      "outsource_request",
      JSON.stringify({
        deal: { ...item },
        sentOut: vendor,
        isRad: department === "Radiology",
        outsources: services,
      })
    );
    window.open(
      "/printout/request/outsource",
      "request",
      "top=100px,left=0px,width=950px,height=750px"
    );
  };

  useEffect(() => {
    if (filtered.length > 0 && endOfTableRef.current) {
      endOfTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filtered]);

  return (
    <MDBTable responsive small>
      <thead>
        <tr>
          <th>#</th>
          {!vendorId && <th>Source</th>}
          <th>Customer</th>
          <th>Services</th>
          <th>Date Send</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filtered?.length > 0 ? (
          filtered.map((item, index) => {
            const {
              services = [],
              vendor = {},
              pid = {},
              createdAt,
              status,
              cancelled = [],
              remarks = "",
              reason = "",
              dealId = {},
            } = item;
            const { name = "", displayname = "" } = vendor || {};
            const isDenied = status === "denied";
            const baseOutsource = displayname || name;

            const isLast = index === filtered.length - 1;
            const isOpen = activeId === item._id;

            return (
              <React.Fragment key={index}>
                <tr ref={isLast ? endOfTableRef : null}>
                  <td>{index + 1}</td>
                  {!vendorId && (
                    <td style={{ fontWeight: 400 }}>{baseOutsource}</td>
                  )}
                  <td style={{ fontWeight: 400 }}>{fullName(pid?.fullName)}</td>
                  <td>
                    {services?.map((id) => {
                      const notProcess = cancelled.includes(id);
                      return (
                        <MDBBadge
                          pill
                          color={
                            !notProcess && status === "done"
                              ? "light"
                              : "primary"
                          }
                          className="mr-2"
                          key={id}
                        >
                          <span
                            title={
                              status === "done"
                                ? `${
                                    notProcess ? "Not Available" : "Completed"
                                  } \n ${Services.getName(id)}`
                                : Services.getName(id)
                            }
                            style={{
                              fontSize: "0.7rem",
                              ...(!notProcess &&
                                status === "done" && {
                                  textDecoration: "line-through",
                                  textDecorationThickness: "3px",
                                  textDecorationColor: "gray",
                                }),
                            }}
                          >
                            {Services.getAbbr(id)}
                          </span>
                        </MDBBadge>
                      );
                    })}
                  </td>
                  <td style={{ fontWeight: 400 }}>
                    <div className="d-flex align-items-center">
                      {dateFormat(createdAt)}
                      {item?.dealId?._id ? (
                        <div className="m-0 p-0 d-flex align-items-center ml-3">
                          <MDBBtn
                            size="sm"
                            color="white"
                            rounded
                            title="View Sendout Sections"
                            onClick={() =>
                              setActiveId((prev) =>
                                prev === item?._id ? -1 : item?._id
                              )
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
                          {!isOpen && (
                            <span
                              className="counter"
                              style={{
                                marginBottom: "-10px",
                                marginRight: "-10px !important",
                              }}
                            >
                              {Object.keys(dealId.soDiagnostic)?.length}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      fontWeight: 500,
                      color: isDenied
                        ? "red"
                        : status === "done"
                        ? "green"
                        : "",
                    }}
                  >
                    {capitalize(status)}
                  </td>
                  <td>
                    <MDBBtn
                      color="primary"
                      rounded
                      size="sm"
                      onClick={() => handlePrint(item)}
                    >
                      <MDBIcon icon="print" />
                    </MDBBtn>
                  </td>
                </tr>
                {item.dealId?._id && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <Task dealId={item.dealId} isOpen={isOpen} />
                    </td>
                  </tr>
                )}
                {(remarks || reason) && (
                  <div className="mt-n4 position-absolute">
                    <MDBTypography
                      noteColor={isDenied ? "danger" : "warning"}
                      className="m-0 p-1"
                      note
                      noteTitle="Remarks: "
                    >
                      {isDenied ? reason : remarks}
                    </MDBTypography>
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <tr>
            <td colSpan={7} className="text-center">
              No sendout record.
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
};

export default Body;

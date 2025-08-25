import React, { useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBView } from "mdbreact";
import SummaryLoading from "../../cashier/cashRegistry/services/deals/summary/loading";
import "./style.css";

export default function Summary({ summaryRef }) {
  const { month, year, activeDate, activeEmployee, collections = [], isLoading } =
    useSelector(({ attendances }) => attendances);

  // If no active date, fallback to today
  const date = activeDate
    ? new Date(year, month - 1, activeDate)
    : new Date(year, month - 1, new Date().getDate());

  const activeDateLabel = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const isSunday = date.getDay() === 0;

  // Filter attendances for the selected employee for the whole month
  const filteredAttendances = useMemo(() => {
    if (!activeEmployee) return [];

    return collections.filter((att) => {
      const createdDate = new Date(att.createdAt);
      return (
        createdDate.getMonth() === month - 1 &&
        createdDate.getFullYear() === year &&
        att.employeeName === activeEmployee.employeeName
      );
    });
  }, [collections, month, year, activeEmployee]);

  const contentRef = useRef(null);

  const expandSection = (element, hasContent, delay = 300) => {
    if (!element) return;
    element.style.transition = "none";
    element.style.overflow = "hidden";
    element.style.height = "0px";

    void element.offsetHeight;

    if (hasContent) {
      setTimeout(() => {
        element.style.transition = "height 0.5s ease-in";
        element.style.height = element.scrollHeight + "px";
        setTimeout(() => {
          element.style.height = "fit-content";
          element.style.overflow = "visible";
        }, 500);
      }, delay);
    } else {
      setTimeout(() => {
        element.style.transition = "height 0.2s ease-out";
        element.style.height = "fit-content";
        element.style.overflow = "visible";
      }, delay);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      expandSection(contentRef.current, filteredAttendances.length > 0);
    }
  }, [filteredAttendances]);

  return (
    <MDBCard narrow>
      <MDBView
        cascade
        className="gradient-card-header custom-header bg-success narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
      >
        <div
          ref={summaryRef}
          className="d-flex justify-content-between items-center font-bold text-lg w-100"
        >
          <span
            className={isSunday ? "text-red-600 text-sm" : "text-gray-600 text-sm"}
          >
            {activeDateLabel}
          </span>
          <span className="text-end">ATTENDANCE SUMMARY</span>
        </div>
      </MDBView>

      <MDBCardBody className="m-0 p-1">
        <div
          className="flex justify-between items-center"
          ref={contentRef}
          style={{ width: "18rem", overflow: "hidden" }}
        >
          {!isLoading ? (
            <div className="w-full">
              <div className="d-flex justify-between align-items-center w-full">
                <p className="font-bold flex-1 text-left">
                  {filteredAttendances.length} Days attended
                </p>
              </div>

              {filteredAttendances.length > 0 ? (
                <div
                  style={{ maxHeight: "58vh", overflowY: "auto" }}
                  className="summary-scrollbar"
                >
                  <ol className="mt-2 list-decimal list-inside">
                    {filteredAttendances.map((att, index) => {
                      const { _id, createdAt, amIn, amOut, pmIn, pmOut } = att;
                      return (
                        <li key={_id || index} className="p-2 border-b">
                          <div className="font-bold">
                            {new Date(createdAt).toLocaleDateString("en-US", {
                              weekday: "long",
                            })}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {new Date(createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-blue-600 mt-1">
                            <strong>AM:</strong> {amIn || "--"} - {amOut || "--"}
                          </div>
                          <div className="text-blue-600 mt-1">
                            <strong>PM:</strong> {pmIn || "--"} - {pmOut || "--"}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : (
                <p className="text-gray-500 mt-5 text-center">
                  {activeEmployee ? "No attendance found for this employee this month." : "Select an employee to view summary."}
                </p>
              )}
            </div>
          ) : (
            <div style={{ width: "18rem" }}>
              <SummaryLoading rowCount={10} />
            </div>
          )}
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

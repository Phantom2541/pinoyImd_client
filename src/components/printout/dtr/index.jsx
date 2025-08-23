import React, { useEffect } from "react";
import Cell from "./cell";

const AttendancePrint = () => {
  const collections = JSON.parse(localStorage.getItem("attendances")) || [];
  console.log("collections", collections);
  

  const firstDate = collections[0]?.createdAt
    ? new Date(collections[0].createdAt)
    : new Date();
  const month = firstDate.getMonth();
  const year = firstDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map existing records
  const recordMap = {};
  collections.forEach((rec) => {
    const recDate = new Date(rec.createdAt);
    if (recDate.getMonth() === month && recDate.getFullYear() === year) {
      const dayNum = recDate.getDate();
      recordMap[dayNum] = {
        ...rec,
        date: dayNum,
        day: recDate.toLocaleDateString("en-US", { weekday: "long" }),
      };
    }
  });

  // Generate all days of the month
  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    if (recordMap[dayNum]) {
      const rec = recordMap[dayNum];
      return { ...rec, isSunday: rec.day === "Sunday" };
    } else {
      const dateObj = new Date(year, month, dayNum);
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      return {
        date: dayNum,
        day: weekday,
        amIn: "",
        amOut: "",
        pmIn: "",
        pmOut: "",
        status: "",
        _id: `empty-${dayNum}`,
        isSunday: weekday === "Sunday",
      };
    }
  });

  // Delay printing
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @page {
          size: landscape;
          margin: 0;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
          }
          .print-container {
            width: 100%;
          }
          .left-copy, .right-copy {
            display: inline-table;
            vertical-align: top;
            width: 48%;
            margin-right: 2%;
            padding: 0.5cm;
            box-sizing: border-box;
            border: 2px solid #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
            font-size: 11px;
            word-wrap: break-word;
          }
          .sunday {
            background-color: #ffe6e6 !important;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Left Copy */}
        <div className="left-copy">
          <table>
            <thead>
              <tr>
                <th colSpan="7" style={{ fontSize: "16px", padding: "6px", fontWeight: "bold" }}>
                  DAILY TIME RECORD
                </th>
              </tr>
              <tr>
                <td colSpan="3"><strong>Employee Name</strong></td>
                <td colSpan="4"><strong>Employee Number</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Pay Period Starting</strong></td>
                <td colSpan="4"><strong>Pay Period Ending</strong></td>
              </tr>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>AM In</th>
                <th>AM Out</th>
                <th>PM In</th>
                <th>PM Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDays.map((item) => (
                <Cell key={`left-${item._id}`} item={item} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7"><strong>Total</strong></td>
              </tr>
              <tr>
                <td colSpan="7"><strong>Notes</strong></td>
              </tr>
              <tr>
                <td colSpan="7"><strong>Approver's Name & Designation</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Employee's Signature</strong></td>
                <td colSpan="4"><strong>Approver's Signature</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Right Copy */}
        <div className="right-copy">
          <table>
            <thead>
              <tr>
                <th colSpan="7" style={{ fontSize: "16px", padding: "6px", fontWeight: "bold" }}>
                  DAILY TIME RECORD
                </th>
              </tr>
              <tr>
                <td colSpan="3"><strong>Employee Name</strong></td>
                <td colSpan="4"><strong>Employee Number</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Pay Period Starting</strong></td>
                <td colSpan="4"><strong>Pay Period Ending</strong></td>
              </tr>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>AM In</th>
                <th>AM Out</th>
                <th>PM In</th>
                <th>PM Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDays.map((item) => (
                <Cell key={`right-${item._id}`} item={item} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7"><strong>Total</strong></td>
              </tr>
              <tr>
                <td colSpan="7"><strong>Notes</strong></td>
              </tr>
              <tr>
                <td colSpan="7"><strong>Approver's Name & Designation</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Employee's Signature</strong></td>
                <td colSpan="4"><strong>Approver's Signature</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePrint;

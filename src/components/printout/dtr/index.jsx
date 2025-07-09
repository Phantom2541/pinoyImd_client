import React, { useEffect } from "react";
import Cell from "./cell";

const AttendancePrint = () => {
  const collections = JSON.parse(localStorage.getItem("attendances")) || [];

  const firstDate = collections[0]?.createdAt
    ? new Date(collections[0].createdAt)
    : new Date();
  const month = firstDate.getMonth() + 1;
  const year = firstDate.getFullYear();
  const jsMonth = month - 1;
  const daysInMonth = new Date(year, jsMonth + 1, 0).getDate();

  const recordMap = {};
  collections.forEach((rec) => {
    const recDate = new Date(rec.createdAt);
    const recMonth = recDate.getMonth() + 1;
    const recYear = recDate.getFullYear();
    if (recMonth === month && recYear === year) {
      const dayNum = recDate.getDate();
      recordMap[dayNum] = {
        ...rec,
        date: dayNum,
        day: recDate.toLocaleDateString("en-US", { weekday: "long" }),
      };
    }
  });

  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    if (recordMap[dayNum]) {
      const rec = recordMap[dayNum];
      return {
        ...rec,
        isSunday: rec.day === "Sunday",
      };
    } else {
      const dateObj = new Date(year, jsMonth, dayNum);
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      return {
        date: dayNum,
        day: weekday,
        in: "",
        out: "",
        status: "",
        _id: `empty-${dayNum}`,
        isSunday: weekday === "Sunday",
      };
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @page {
          size: landscape;
          margin: 0;
        }
        @media print {
          /* force background colors to print */
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
            display: flex;
            width: 100%;
            position: relative;
            height: 100vh;
          }
          .left-copy, .right-copy {
            width: 50%;
            height: 100%;
            padding: 1cm;
            box-sizing: border-box;
            border: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .divider {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: -1px;
            border-left: 2px dashed #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 12px;
            word-wrap: break-word;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Left Copy */}
        <div className="left-copy">
          <table>
            <thead>
              <tr>
                <th colSpan="5" style={{ fontSize: "20px", padding: "10px", fontWeight: "bold" }}>
                  DAILY TIME RECORD
                </th>
              </tr>
              <tr>
                <td colSpan="2"><strong>Employee Name</strong></td>
                <td colSpan="3"><strong>Employee Number</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Pay Period Starting</strong></td>
                <td colSpan="3"><strong>Pay Period Ending</strong></td>
              </tr>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>In</th>
                <th>Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDays.map((item) => (
                <Cell key={`left-${item._id || `day-${item.date}`}`} item={item} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5"><strong>Total</strong></td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Notes</strong></td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Approver's Name & Designation</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Employee's Signature</strong></td>
                <td colSpan="3"><strong>Approver's Signature</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Right Copy (Mirror) */}
        <div className="right-copy">
          <table>
            <thead>
              <tr>
                <th colSpan="5" style={{ fontSize: "20px", padding: "10px", fontWeight: "bold" }}>
                  DAILY TIME RECORD
                </th>
              </tr>
              <tr>
                <td colSpan="2"><strong>Employee Name</strong></td>
                <td colSpan="3"><strong>Employee Number</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Pay Period Starting</strong></td>
                <td colSpan="3"><strong>Pay Period Ending</strong></td>
              </tr>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>In</th>
                <th>Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allDays.map((item) => (
                <Cell key={`right-${item._id || `day-${item.date}`}`} item={item} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5"><strong>Total</strong></td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Notes</strong></td>
              </tr>
              <tr>
                <td colSpan="5"><strong>Approver's Name & Designation</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Employee's Signature</strong></td>
                <td colSpan="3"><strong>Approver's Signature</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePrint;

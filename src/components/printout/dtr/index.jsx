import React, { useEffect } from "react";
import Cell from "./cell";

const AttendancePrint = () => {
  const collections = JSON.parse(localStorage.getItem("attendances")) || [];

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
    .dtr-printout-container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    }
  .dtr-printout-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  margin-bottom: 20px;
}

.dtr-printout-table th,
.dtr-printout-table td {
  border: 1px solid #333;
  padding: 6px 8px;
  text-align: center;
  font-size: 14px;
}

.dtr-printout-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.dtr-printout-table thead tr:first-child th {
  font-size: 16px;
  padding: 10px 6px;
}

.dtr-printout-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.dtr-printout-table tfoot td {
  font-weight: bold;
  background-color: #f9f9f9;
}

@media print {
  .dtr-printout-table {
    page-break-inside: auto;
    font-size: 12px;
  }

  .dtr-printout-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  .dtr-printout-table th,
  .dtr-printout-table td {
    border: 1px solid #000;
  }
}
      `}</style>

      <div className="dtr-printout-container" style={{display:"flex"}}>
        {/* Left Copy */}
          <table className="dtr-printout-table">
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
          <Cell key={item._id || `day-${item.date}`} item={item} />
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

        {/* Right Copy */}
          <table className="dtr-printout-table">
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
  );
};

export default AttendancePrint;

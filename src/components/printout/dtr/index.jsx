import React, { useEffect } from "react";
import { MDBTable } from "mdbreact";
import Cell from "./cell";

const AttendancePrint = () => {
  const collections = JSON.parse(localStorage.getItem("attendances")) || [];
  console.log("collections: ", collections);

  // If no records, fallback to today
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
    const recMonth = recDate.getMonth() + 1; // 1-based
    const recYear = recDate.getFullYear();

    // Filter to only records of the same month/year
    if (recMonth === month && recYear === year) {
      const dayNum = recDate.getDate();
      recordMap[dayNum] = {
        ...rec,
        date: dayNum,
        day: recDate.toLocaleDateString("en-US", { weekday: "long" }),
        isSunday: recDate.getDay() === 0,
      };
    }
  });

  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    if (recordMap[dayNum]) {
      return recordMap[dayNum];
    } else {
      const dateObj = new Date(year, jsMonth, dayNum);
      return {
        date: dayNum,
        day: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
        in: "",
        out: "",
        status: "",
        isSunday: dateObj.getDay() === 0,
        _id: `empty-${dayNum}`,
      };
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <style>{`
        @page {
          size: landscape;
          margin: 10mm;
        }
        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
          }
          table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
            font-size: 12px;
            word-wrap: break-word;
          }
          th:nth-child(1),
          td:nth-child(1) {
            text-align: left;
          }
        }
      `}</style>

      <MDBTable responsive hover bordered>
        <thead
          style={{
            backgroundColor: "#f0f0f0",
            color: "black",
            textAlign: "center",
          }}
        >
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
            <Cell key={item._id || `day-${item.date}`} item={item} />
          ))}
        </tbody>
      </MDBTable>
    </div>
  );
};

export default AttendancePrint;

import React, { useEffect } from "react";
import Cell from "./cell";
import { Cloudinary } from "../../../services/utilities";
import { useSelector } from "react-redux";

const AttendancePrint = () => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const company = activePlatform?.branch?.companyId?.name || "";
  const branch = activePlatform?.branch?.name || "";

  const collections = JSON.parse(localStorage.getItem("attendances")) || [];

  const firstDate = collections[0]?.createdAt
    ? new Date(collections[0].createdAt)
    : new Date();
  const month = firstDate.getMonth();
  const year = firstDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bannerSrc = `${Cloudinary.getEndpoint()}/companies/${company}/${branch}/banner`;

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
        amIn: rec?.am?.in || "",
        amOut: rec?.am?.out || "",
        pmIn: rec?.pm?.in || "",
        pmOut: rec?.pm?.out || "",
        status: rec?.status || "",
      };
    }
  });

  // Generate all days
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

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 1800);
    return () => clearTimeout(timer);
  }, []);

  const renderTable = (keyPrefix = "") => (
    <table className="dtr-printout-table">
      <thead>
        <tr>
          <th colSpan="7">
            <img src={bannerSrc} alt="Banner" className="dtr-printout-banner" />
          </th>
        </tr>
        <tr>
          <th colSpan="7">DAILY TIME RECORD</th>
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
          <Cell key={`${keyPrefix}${item._id || item.date}`} item={item} />
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
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
   <style>{`
  @media print {
    @page {
      size: portrait;
      margin: 5mm;
    }
    body { margin: 0; padding: 0; }
  }

  .dtr-printout-container {
    display: flex;
    justify-content: space-between;
    gap: 2.5%;
  }

  .dtr-copy {
    width: 49%;
  }

  .separator {
    border-left: 2px dashed black;
    height: 100vh;
  }

  .dtr-printout-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
    margin-top: 16mm;
    margin-bottom: -16mm;
  }

  .dtr-printout-table th,
  .dtr-printout-table td {
    border: 1px solid #000;
    padding: 2px 4px;
    text-align: center;
  }

  .dtr-printout-table th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  .dtr-printout-banner {
    width: 100%;
    max-height: 50px;
    object-fit: fill;
  }
`}</style>


      <div className="dtr-printout-container">
        <div className="dtr-copy">{renderTable("left-")}</div>
        <div className="separator"></div>
        <div className="dtr-copy">{renderTable("right-")}</div>
      </div>
    </div>
  );
};

export default AttendancePrint;

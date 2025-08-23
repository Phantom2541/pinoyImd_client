import React from "react";
import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import Cell from "./cell";

const Index = () => {
  const { month, year, collections = [] } = useSelector(({ attendances }) => attendances);

  const jsMonth = month - 1;
  const daysInMonth = new Date(year, jsMonth + 1, 0).getDate();

  const recordMap = {};
  collections.forEach((rec) => {
    const recDate = new Date(rec.createdAt);
    const recMonth = recDate.getMonth();
    const recYear = recDate.getFullYear();
    const dayNum = recDate.getDate();

    if (recMonth === jsMonth && recYear === year) {
      recordMap[dayNum] = {
        ...rec,
        date: dayNum,
        day: recDate.toLocaleDateString("en-US", { weekday: "long" }),
        amIn: rec?.am?.in || "",
        amOut: rec?.am?.out || "",
        pmIn: rec?.pm?.in || "",
        pmOut: rec?.pm?.out || "",
        status: rec?.status || "",
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
        amIn: "",
        amOut: "",
        pmIn: "",
        pmOut: "",
        status: "",
        isSunday: dateObj.getDay() === 0,
        _id: `empty-${dayNum}`,
      };
    }
  });

  return (
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
    </MDBTable>
  );
};

export default Index;

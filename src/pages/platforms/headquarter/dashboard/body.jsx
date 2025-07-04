import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "d3-format";

const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Body({ selectedBranches, fullData }) {
  const [range, setRange] = useState("day");
  const [selectedMonth, setSelectedMonth] = useState("January");

  const timeMap = {};

  selectedBranches.forEach((branch) => {
    const branchData = fullData[branch];
    if (!branchData) return;

    if (range === "day") {
      const monthData = branchData[selectedMonth] || [];
      monthData.forEach((item) => {
        const timeKey = `Day ${item.day}`;
        if (!timeMap[timeKey]) timeMap[timeKey] = { time: timeKey };
        timeMap[timeKey][branch] = item.price;
      });
    } else if (range === "week") {
      const monthData = branchData[selectedMonth] || [];
      const weeks = [[], [], [], [], []];

      monthData.forEach((item) => {
        const day = item.day;
        let idx = 0;
        if (day <= 7) idx = 0;
        else if (day <= 14) idx = 1;
        else if (day <= 21) idx = 2;
        else if (day <= 28) idx = 3;
        else idx = 4;
        weeks[idx].push(item.price);
      });

      weeks.forEach((prices, index) => {
        const total = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) : 0;
        const timeKey = `Week ${index + 1}`;
        if (!timeMap[timeKey]) timeMap[timeKey] = { time: timeKey };
        timeMap[timeKey][branch] = total;
      });
    } else if (range === "month") {
      Object.entries(branchData).forEach(([month, days]) => {
        if (Array.isArray(days)) {
          const total = days.reduce((sum, item) => sum + item.price, 0);
          if (!timeMap[month]) timeMap[month] = { time: month };
          timeMap[month][branch] = total;
        }
      });
    }
  });

  const combinedData = Object.values(timeMap);
  const branchesWithData = selectedBranches.filter((branch) =>
    combinedData.some((d) => d[branch] !== undefined)
  );

  return (
    <div className="headquarter-dashboard-container">
      <div className="headquarter-coinchart-container">
        {/* Month Buttons + All Month Button */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          {range !== "month" && (
            <div className="month-selection-buttons">
              {allMonths.map((month) => (
                <button
                  key={month}
                  className={`month-btn ${
                    selectedMonth === month ? "active" : ""
                  }`}
                  onClick={() => setSelectedMonth(month)}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          <button
            className={`month-btn ${range === "month" ? "active" : ""}`}
            onClick={() => setRange("month")}
          >
            All Month
          </button>
        </div>

        {/* Range Buttons */}
        <div className="headquarter-range-buttons">
          {["Day", "Week"].map((label) => {
            const value = label.toLowerCase();
            return (
              <button
                key={label}
                className={`headquarter-range-btn ${
                  range === value ? "active" : ""
                }`}
                onClick={() => setRange(value)}
                disabled={range === "month"}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <AreaChart data={combinedData}>
              <XAxis dataKey="time" />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(value) => `₱${format(",")(value)}`}
              />
              <Tooltip formatter={(value) => `₱${format(",")(value)}`} />
              <Legend />
              {branchesWithData.map((branch) => {
                const color = fullData[branch]?.color || "#ccc";
                return (
                  <Area
                    key={branch}
                    type="spike"
                    dataKey={branch}
                    stroke={color}
                    fill="none"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: color,
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

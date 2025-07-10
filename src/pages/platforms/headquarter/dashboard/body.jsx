import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

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
        let idx = Math.min(Math.floor((day - 1) / 7), 4);
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

  const combinedData = Object.values(timeMap).sort((a, b) =>
    a.time.localeCompare(b.time, undefined, { numeric: true })
  );
  const labels = combinedData.map((item) => item.time);
  const branchesWithData = selectedBranches.filter((branch) =>
    combinedData.some((d) => d[branch] !== undefined)
  );

  const chartData = {
    labels,
    datasets: branchesWithData.map((branch) => ({
      label: branch,
      data: combinedData.map((item) => item[branch] || null),
      borderColor: fullData[branch]?.color || "#ccc",
      backgroundColor: (fullData[branch]?.color || "#ccc") + "33",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: "#fff",
      borderWidth: 2,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `₱${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => `₱${val.toLocaleString()}`,
        },
      },
    },
  };

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
        <div style={{ width: "100%", height: "auto" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

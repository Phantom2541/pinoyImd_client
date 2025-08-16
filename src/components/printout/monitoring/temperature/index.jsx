import { Line } from "react-chartjs-2";
import React, { useEffect } from "react";
import { Chart } from "chart.js";

// Register necessary components for Chart.js v3
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Banner } from "../../../../services/utilities";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the normal ranges for room and ref
const NORMAL_ROOM_RANGE = { min: 20, max: 25 }; // Example range
const NORMAL_REF_RANGE = { min: 2, max: 8 }; // Example range

// Chart data configuration
const barChartData = (labels, roomAM, roomPM, refAM, refPM) => ({
  labels,
  datasets: [
    {
      label: "Room AM",
      data: roomAM,
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      fill: false,
    },
    {
      label: "Room PM",
      data: roomPM,
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
      fill: false,
    },
    {
      label: "Ref AM",
      data: refAM,
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
      fill: false,
    },
    {
      label: "Ref PM",
      data: refPM,
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      fill: false,
    },
    // ROOM RANGE (Dashed Lines)
    {
      label: "Room Min (20°C)",
      data: labels.map(() => NORMAL_ROOM_RANGE.min),
      borderColor: "rgba(200, 0, 0, 0.6)",
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false,
    },
    {
      label: "Room Max (25°C)",
      data: labels.map(() => NORMAL_ROOM_RANGE.max),
      borderColor: "rgba(200, 0, 0, 0.6)",
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false,
    },
    // REF RANGE (Dashed Lines)
    {
      label: "Ref Min (2°C)",
      data: labels.map(() => NORMAL_REF_RANGE.min),
      borderColor: "rgba(0, 0, 200, 0.6)",
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false,
    },
    {
      label: "Ref Max (8°C)",
      data: labels.map(() => NORMAL_REF_RANGE.max),
      borderColor: "rgba(0, 0, 200, 0.6)",
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false,
    },
  ],
});

// Chart options configuration for Chart.js v3
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        color: "#7e8591",
      },
    },
    y: {
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        beginAtZero: true,
        min: 0,
        color: "#7e8591",
      },
      title: {
        display: true,
        text: "Temperature (°C)",
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: "#7e8591",
        font: {
          size: 16,
        },
      },
    },
  },
};

// TempPrint component to render the graph
const TempPrint = () => {
  const { collections = [], branch = {} } =
    JSON.parse(localStorage.getItem("temperature") || "{}") || {};

  // Initialize arrays for the graph data
  const titles = collections.length
    ? collections.map((item) => {
        const date = new Date(item.createdAt);
        return `${date.toLocaleString("default", {
          month: "long",
        })} ${date.getDate()}`;
      })
    : ["No Record Found"];

  // Data arrays for AM and PM values of room and ref
  const roomAM = collections.map((item) => item.AM?.room || 0);
  const roomPM = collections.map((item) => item.PM?.room || 0);
  const refAM = collections.map((item) => item.AM?.ref || 0);
  const refPM = collections.map((item) => item.PM?.ref || 0);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: landscape;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div>
      <Banner
        company={branch?.companyId?.name}
        branch={branch?.name}
        className="laboratory-banner"
        bid={branch?.bid || ""}
      />
      <h3 className="text-center fw-bold mt-2">Temperature Monitoring</h3>
      <Line
        data={barChartData(titles, roomAM, roomPM, refAM, refPM)}
        options={barChartOptions}
        height={150}
      />
    </div>
  );
};

export default TempPrint;

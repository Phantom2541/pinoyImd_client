import { Line } from "react-chartjs-2";
import React from "react";

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

// Chart options configuration
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        gridLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          fontColor: "#7e8591",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          fontColor: "#7e8591",
        },
        // Draw horizontal lines for normal ranges
        drawOnChartArea: true,
        scaleLabel: {
          display: true,
        },
      },
    ],
  },
  legend: {
    labels: {
      fontColor: "#7e8591",
      fontSize: 16,
    },
  },
  annotation: {
    // Add horizontal lines for normal ranges
    annotations: [
      {
        id: "roomMin",
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: NORMAL_ROOM_RANGE.min,
        borderColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2,
        label: {
          enabled: true,
          content: "Room Min",
          position: "left",
          fontColor: "rgba(255, 99, 132, 0.5)",
        },
      },
      {
        id: "roomMax",
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: NORMAL_ROOM_RANGE.max,
        borderColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2,
        label: {
          enabled: true,
          content: "Room Max",
          position: "left",
          fontColor: "rgba(255, 99, 132, 0.5)",
        },
      },
      {
        id: "refMin",
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: NORMAL_REF_RANGE.min,
        borderColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 2,
        label: {
          enabled: true,
          content: "Ref Min",
          position: "left",
          fontColor: "rgba(75, 192, 192, 0.5)",
        },
      },
      {
        id: "refMax",
        type: "line",
        mode: "horizontal",
        scaleID: "y-axis-0",
        value: NORMAL_REF_RANGE.max,
        borderColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 2,
        label: {
          enabled: true,
          content: "Ref Max",
          position: "left",
          fontColor: "rgba(75, 192, 192, 0.5)",
        },
      },
    ],
  },
};

// TempPrint component to render the graph
const TempPrint = () => {
  const collections = JSON.parse(localStorage.getItem("temperature")) || [];

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

  return (
    <div>
      <Line
        data={barChartData(titles, roomAM, roomPM, refAM, refPM)}
        options={barChartOptions}
        height={150}
      />
    </div>
  );
};

export default TempPrint;

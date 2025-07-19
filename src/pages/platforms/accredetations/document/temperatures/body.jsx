import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js";

import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Body = () => {
  const chartRef = useRef(null); // ✅ for printing
  const { collections = [] } = useSelector(({ temperatures }) => temperatures);

  const NORMAL_ROOM_RANGE = { min: 20, max: 25 };
  const NORMAL_REF_RANGE = { min: 2, max: 8 };

  if (!collections.length) {
    return <p className="text-center mt-4">No temperature records found.</p>;
  }

  const sortedCollections = [...collections].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const labels = sortedCollections.map((item) => {
    const date = new Date(item.createdAt);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
  });

  const roomAM = collections.map((item) => item.AM?.room ?? null);
  const roomPM = collections.map((item) => item.PM?.room ?? null);
  const refAM = collections.map((item) => item.AM?.ref ?? null);
  const refPM = collections.map((item) => item.PM?.ref ?? null);

  const data = {
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
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#555",
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#555" },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
      y: {
        beginAtZero: true,
        min: 0,
        ticks: { color: "#555" },
        grid: { color: "rgba(0,0,0,0.1)" },
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  const printChart = () => {
    if (chartRef.current) {
      const chartCanvas = chartRef.current.canvas;
      const chartImage = chartCanvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
        <head>
          <title>Print Chart</title>
          <style>
            @media print {
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              img { width: 100vw; height: 100vh; object-fit: contain; }
            }
            body { text-align: center; margin: 0; }
            img { width: 100%; max-width: 1000px; }
          </style>
        </head>
        <body>
          <img src="${chartImage}" />
          <script>
            const img = document.querySelector("img");
            img.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ height: "400px" }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="text-center" style={{ marginTop: "16px" }}>
        <button
          onClick={printChart}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Print Chart
        </button>
      </div>
    </div>
  );
};

export default Body;

import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import { Chart } from "chart.js/auto";

const calculateStats = (data) => {
  if (!data.length) return { mean: 0, stdDev: 0 };

  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
};

const LeveyJennings = ({ title }) => {
  const { collections } = useSelector(({ controls }) => controls),
    [hi, setHi] = useState([]),
    [norm, setNorm] = useState([]),
    [lo, setLo] = useState([]),
    [days, setDays] = useState([]);
  const { mean, stdDev } = calculateStats([...norm]);
  const chartRef = useRef(null);

  useEffect(() => {
    // Extract hi, lo, normal, and days from the fetched data
    setHi(collections.map((item) => item.hi));
    setLo(collections.map((item) => item.lo));
    setNorm(collections.map((item) => item.norm));
    setDays(
      collections.map((item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
        })
      )
    );
  }, [collections]);

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
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const lineChartData = {
    labels: [...days],
    datasets: [
      {
        label: "Normal Values",
        data: [...norm],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "High Values",
        data: [...hi],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Low Values",
        data: [...lo],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Mean",
        data: new Array(norm.length).fill(mean),
        borderColor: "rgba(0, 0, 0, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
      {
        label: "+2 SD",
        data: new Array(norm.length).fill(mean + 2 * stdDev),
        borderColor: "rgba(255, 165, 0, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
      {
        label: "-2 SD",
        data: new Array(norm.length).fill(mean - 2 * stdDev),
        borderColor: "rgba(255, 165, 0, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { color: "#7e8591" } },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        ticks: { color: "#7e8591" },
      },
    },
    plugins: {
      legend: { labels: { color: "#7e8591", font: { size: 14 } } },
      title: {
        display: true,
        text: title || "Levey-Jennings Control Chart",
        font: { size: 16 },
        color: "#333",
      },
    },
  };

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody
          className="d-flex flex-column justify-content-between"
          style={{ height: "100%" }}
        >
          <div style={{ width: "100%", height: "300px" }}>
            <Line
              ref={chartRef}
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>

          {/* Footer with Print Button */}
          <div className="mt-auto text-center">
            <button
              onClick={printChart}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "auto",
              }}
            >
              Print Chart
            </button>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBAnimation>
  );
};

export default LeveyJennings;

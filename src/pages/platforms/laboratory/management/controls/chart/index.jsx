import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";

// Register the required components
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const calculateStats = (data) => {
  if (!data.length) return { mean: 0, stdDev: 0 };

  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
};

const LeveyJennings = ({ title }) => {
  const { filtered } = useSelector(({ controls }) => controls);
  const [hi, setHi] = useState([]);
  const [norm, setNorm] = useState([]);
  const [lo, setLo] = useState([]);
  const [days, setDays] = useState([]);
  const { mean, stdDev } = calculateStats([...norm]);
  const chartRef = useRef(null);

  useEffect(() => {
    setHi(filtered.map((item) => item.hi));
    setLo(filtered.map((item) => item.lo));
    setNorm(filtered.map((item) => item.norm));
    setDays(
      filtered.map((item) =>
        new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit" })
      )
    );
  }, [filtered]);

const printChart = () => {
  if (chartRef.current) {
    const chartCanvas = chartRef.current.canvas;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = chartCanvas.width * 3;
    tempCanvas.height = chartCanvas.height * 3;
    const ctx = tempCanvas.getContext("2d");

    ctx.scale(3, 3);
    ctx.drawImage(chartCanvas, 0, 0);

    const chartImage = tempCanvas.toDataURL("image/png");
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Chart</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }

            html, body {
              margin: 0;
              height: 100%;
              overflow: hidden;
              background: white;
            }

            .chart-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              padding: 50px;
              box-sizing: border-box;
            }

            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              page-break-inside: avoid;
              break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <div class="chart-container">
            <img src="${chartImage}" />
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
};

  const lineChartData = {
    labels: days,
    datasets: [
      {
        label: "Normal Values",
        data: norm,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "High Values",
        data: hi,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Low Values",
        data: lo,
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
          <div style={{ width: "100%", height: "600px" }}>
            <Line
              ref={chartRef}
              data={lineChartData}
              options={lineChartOptions}
            />
          </div>

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

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
import { Cloudinary, FailedBanner } from "../../../../../../services/utilities";
// import { Cloudinary, FailedBanner } from "../index";

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
  const { activePlatform } = useSelector(({ auth }) => auth);

  const { filtered } = useSelector(({ controls }) => controls);
  const [hi, setHi] = useState([]);
  const [norm, setNorm] = useState([]);
  const [lo, setLo] = useState([]);
  const [days, setDays] = useState([]);
  const { mean, stdDev } = calculateStats([...norm]);
  const chartRef = useRef(null);
  const company = activePlatform?.branch?.companyId?.name;
  const branch = activePlatform?.branch?.name;

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
    if (!chartRef.current) return;

    const chartCanvas = chartRef.current.canvas;
    const chartImage = chartCanvas.toDataURL("image/png"); // gawing image yung chart

    const printWindow = window.open(
      `/printout/chart`,
      `${title} Logbook`,
      "top=100px,left=100px,width=1050px,height=750px"
    );

    const bannerSrc = `${Cloudinary.getEndpoint()}/companies/${company}/${branch}/banner.png`;

    printWindow.document.write(`
    <html>
      <head>
        <title>${title || "Levey-Jennings Control Chart"}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
 
          h1, h2 { margin: 0; }
          img { max-width: 100%; height: auto; margin-top: 20px; }
        </style>
      </head>
      <body>
        <header>
        <img src="${bannerSrc}" width="100%" height="85px" onerror="this.src='${FailedBanner}'" />
        </header>
        <h3>${title || "Levey-Jennings Control Chart"}</h3>
        <img src="${chartImage}" />
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };
  console.log("company", activePlatform?.branch?.companyId?.name);
  console.log("branch", activePlatform?.branch?.name);

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

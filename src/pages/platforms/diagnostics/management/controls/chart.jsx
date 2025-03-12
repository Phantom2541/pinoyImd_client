import React from "react";
import { Line } from "react-chartjs-2";

const generateFakeValues = (numDays, baseValue, variance) => {
  return Array.from(
    { length: numDays },
    () => baseValue + (Math.random() * variance - variance / 2)
  );
};

const calculateStats = (data) => {
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance =
    data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
};

const LeveyJennings = ({ title, values = generateFakeValues(7, 10, 4) }) => {
  const highValues = generateFakeValues(values.length, 12, 4);
  const lowValues = generateFakeValues(values.length, 8, 4);
  const { mean, stdDev } = calculateStats(values);
  const labels = values.map((_, index) => `Day ${index + 1}`);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Normal Values",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "High Values",
        data: highValues,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Low Values",
        data: lowValues,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Mean",
        data: Array(values.length).fill(mean),
        borderColor: "rgba(0, 0, 0, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
      {
        label: "+2 SD",
        data: Array(values.length).fill(mean + 2 * stdDev),
        borderColor: "rgba(255, 165, 0, 1)",
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
      },
      {
        label: "-2 SD",
        data: Array(values.length).fill(mean - 2 * stdDev),
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
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#7e8591",
        },
      },
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#7e8591",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#7e8591",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: title || "Levey-Jennings Control Chart",
        font: {
          size: 16,
        },
        color: "#333",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Line data={lineChartData} options={lineChartOptions} />
    </div>
  );
};

export default LeveyJennings;

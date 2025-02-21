import { Line } from "react-chartjs-2";
import React from "react";
// import "./index.css";

const barChartData = {
  labels: ["1 AM", "1 PM", "2 AM", "2 PM", "3 AM", "3 PM", "4 AM", "4 PM"],
  datasets: [
    {
      label: "Room",
      data: [22, 19, 25, 23, 24],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
    {
      label: "Ref",
      data: [3.2, 5, 4.5, 6.1, 4.3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        barPercentage: 1,
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
      },
    ],
  },
  legend: {
    labels: {
      fontColor: "#7e8591",
      fontSize: 16,
    },
  },
};

const ChemsPrint = () => {
  // const [chems, setChems] = useState([]);
  // const [chartData, setChartData] = useState({});
  // const { collections } = useSelector(({ chemistry }) => chemistry);
  // const { token, activePlatform } = useSelector(({ auth }) => auth);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (token && activePlatform?._id) {
  //     dispatch(
  //       BROWSE({
  //         entity: "results/laboratory/chemistry/logbook",
  //         data: {
  //           branch: activePlatform?.branchId,
  //           month,
  //           year,
  //         },
  //         token,
  //       })
  //     );
  //   }
  //   return () => RESET();
  // }, [activePlatform, dispatch, token, month, year]);

  //   useEffect(() => {
  //     setChems(collections);
  //     if (collections.length) {
  //       generateChartData(collections);
  //     }
  //   }, [collections]);

  return (
    <div>
      <Line data={barChartData} options={barChartOptions} height={150} />
    </div>
  );
};

export default ChemsPrint;

// import { MDBContainer } from "mdbreact";
// import { Line } from "react-chartjs-2";
// import React, { useState, useEffect } from "react";
// import "./index.css";
// import { useSelector, useDispatch } from "react-redux";
// import { MDBIcon } from "mdbreact";
// import { fullName, getAge, Banner } from "../../../services/utilities";

// const ChemsPrint = () => {
//   const [chems, setChems] = useState([]);
//   const [chartData, setChartData] = useState({});
//   const { collections } = useSelector(({ chemistry }) => chemistry);
//   const { token, onDuty } = useSelector(({ auth }) => auth);
//   const dispatch = useDispatch();

//   // useEffect(() => {
//   //   if (token && onDuty?._id) {
//   //     dispatch(
//   //       BROWSE({
//   //         entity: "results/laboratory/chemistry/logbook",
//   //         data: {
//   //           branch: onDuty._id,
//   //           month,
//   //           year,
//   //         },
//   //         token,
//   //       })
//   //     );
//   //   }
//   //   return () => RESET();
//   // }, [onDuty, dispatch, token, month, year]);

//   useEffect(() => {
//     setChems(collections);
//     if (collections.length) {
//       generateChartData(collections);
//     }
//   }, [collections]);

//   const generateChartData = (data) => {
//     const grouped = groupByDay(data);
//     const days = Object.keys(grouped);
//     const rbsValues = days.map(
//       (day) =>
//         grouped[day].reduce((sum, chem) => sum + (chem.packages["9"] || 0), 0) /
//         grouped[day].length
//     );

//     setChartData({
//       labels: days,
//       datasets: [
//         {
//           label: "RBS Levels",
//           data: rbsValues,
//           fill: false,
//           backgroundColor: "rgba(0, 123, 255, 0.4)",
//           borderColor: "#007bff",
//         },
//       ],
//     });
//   };

//   const groupByDay = (chemistryData) =>
//     chemistryData.reduce((acc, chem) => {
//       const createdAt = new Date(chem.createdAt);
//       const day = createdAt.getDate();
//       if (!acc[day]) acc[day] = [];
//       acc[day].push(chem);
//       return acc;
//     }, {});

//   const renderGroupedChems = () => {
//     // Existing renderGroupedChems code...
//   };

//   return (
//     <div>
//       <Banner company={onDuty?.companyId?.name} branch={onDuty?.name} />

//       <h3 className="text-center">
//         Chemistry Report for {Months[month - 1]} {year}
//       </h3>

//       <MDBContainer>
//         <h5 className="text-center">
//           RBS Levels Over Days in {Months[month - 1]}
//         </h5>
//         <Line data={chartData} options={{ responsive: true }} />
//       </MDBContainer>

//       <MDBTable className="responsive">
//         <thead>{/* Table headers as in the original */}</thead>
//         <tbody>{renderGroupedChems()}</tbody>
//       </MDBTable>
//     </div>
//   );
// };

// export default ChemsPrint;

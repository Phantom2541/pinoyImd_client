import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBCard,
  MDBRow,
  MDBCol,
  MDBView,
  MDBCardBody,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
  MDBBadge,
  MDBDatePicker,
} from "mdbreact";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { axioKit, currency } from "../../../../services/utilities";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const monthLabels = [
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

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        barPercentage: 0.7,
        gridLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.08)",
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
          color: "rgba(0, 0, 0, 0.08)",
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          fontColor: "#7e8591",
          callback: (value) => currency.format(value),
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
  tooltips: {
    callbacks: {
      label: (tooltipItem) =>
        `Gross Sales: ${currency.format(tooltipItem.yLabel)}`,
    },
  },
};

const Transactions = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    [monthlyGrossSales, setMonthlyGrossSales] = useState(new Array(12).fill(0)),
    [selectedYear] = useState(new Date().getFullYear());
  const presentMonthIndex = new Date().getMonth();

  useEffect(() => {
    if (!token || !activePlatform?.branchId || !auth?._id) return;

    axioKit
      .universal(`commerce/pos/services/deals/yearly`, token, {
        branchId: activePlatform.branchId,
        cashierId: auth._id,
        year: selectedYear,
      })
      .then((res) => {
        const stats = res?.payload?.monthlyStatistic || [];
        const monthlyTotals = new Array(12).fill(0);

        stats.forEach((entry) => {
          const [monthIndex, total] = Object.entries(entry || {})[0] || [];
          if (monthIndex === undefined) return;

          monthlyTotals[Number(monthIndex)] = Number(total || 0);
        });

        setMonthlyGrossSales(monthlyTotals);
      })
      .catch((err) => console.log(err.message));
  }, [activePlatform?.branchId, auth?._id, selectedYear, token]);

  const barChartData = useMemo(
    () => ({
      labels: monthLabels.slice(0, presentMonthIndex + 1),
      datasets: [
        {
          label: "Gross Sales",
          data: monthlyGrossSales.slice(0, presentMonthIndex + 1),
          backgroundColor: [
            "rgba(0, 121, 107, 0.18)",
            "rgba(3, 169, 244, 0.18)",
            "rgba(255, 193, 7, 0.18)",
            "rgba(255, 87, 34, 0.18)",
            "rgba(139, 195, 74, 0.18)",
            "rgba(233, 30, 99, 0.18)",
            "rgba(156, 39, 176, 0.18)",
            "rgba(0, 150, 136, 0.18)",
            "rgba(63, 81, 181, 0.18)",
            "rgba(255, 152, 0, 0.18)",
            "rgba(76, 175, 80, 0.18)",
            "rgba(33, 150, 243, 0.18)",
          ],
          borderColor: [
            "rgba(0, 121, 107, 1)",
            "rgba(3, 169, 244, 1)",
            "rgba(255, 193, 7, 1)",
            "rgba(255, 87, 34, 1)",
            "rgba(139, 195, 74, 1)",
            "rgba(233, 30, 99, 1)",
            "rgba(156, 39, 176, 1)",
            "rgba(0, 150, 136, 1)",
            "rgba(63, 81, 181, 1)",
            "rgba(255, 152, 0, 1)",
            "rgba(76, 175, 80, 1)",
            "rgba(33, 150, 243, 1)",
          ].slice(0, presentMonthIndex + 1),
          borderWidth: 1,
        },
      ],
    }),
    [monthlyGrossSales, presentMonthIndex]
  );

  const yearToDateGrossSales = monthlyGrossSales.reduce(
    (total, amount) => total + amount,
    0
  );

  return (
    <MDBCard cascade narrow>
      <MDBRow>
        <MDBCol xl="5" md="12" className="mr-0">
          <MDBView
            cascade
            className="gradient-card-header light-blue lighten-1"
          >
            <h4 className="h4-responsive mb-0 font-weight-bold">
              Gross Sales {selectedYear}
            </h4>
          </MDBView>
          <MDBCardBody cascade className="pb-3">
            <MDBRow className="pt-3 card-body">
              <MDBCol md="12">
                <h4>
                  <MDBBadge className="big-badge light-blue lighten-1">
                    Year to Date
                  </MDBBadge>
                </h4>
                <div className="mt-3">
                  <h3 className="font-weight-bold mb-1">
                    {currency.format(yearToDateGrossSales)}
                  </h3>
                  <p className="grey-text mb-0">
                    Your gross sales for {selectedYear}
                  </p>
                </div>
                <h4 className="mt-4">
                  <MDBBadge className="big-badge light-blue lighten-1">
                    Data range
                  </MDBBadge>
                </h4>
                <MDBSelect>
                  <MDBSelectInput selected="Choose time period" />
                  <MDBSelectOptions>
                    <MDBSelectOption disabled>
                      Choose time period
                    </MDBSelectOption>
                    <MDBSelectOption value="1">Today</MDBSelectOption>
                    <MDBSelectOption value="2">Yesterday</MDBSelectOption>
                    <MDBSelectOption value="3">Last 7 days</MDBSelectOption>
                    <MDBSelectOption value="4">Last 30 days</MDBSelectOption>
                    <MDBSelectOption value="5">Last week</MDBSelectOption>
                    <MDBSelectOption value="6">Last month</MDBSelectOption>
                  </MDBSelectOptions>
                </MDBSelect>
                <h5>
                  <MDBBadge className="big-badge light-blue lighten-1">
                    Custom date
                  </MDBBadge>
                </h5>
                <br />
                <div className="mb-1">
                  <MDBRow>
                    <MDBCol size="6">
                      <small className="grey-text">from:</small>
                      <MDBDatePicker className="my-0 d-inline ml-3" />
                    </MDBCol>
                    <MDBCol size="6">
                      <small className="grey-text">to:</small>
                      <MDBDatePicker className="my-0 d-inline ml-3" />
                    </MDBCol>
                  </MDBRow>
                </div>
                <p className="grey-text mt-3 mb-0">
                  The graph reflects your actual gross sales from January to{" "}
                  {monthLabels[presentMonthIndex]} {selectedYear}.
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCol>
        <MDBCol md="12" xl="7">
          <MDBView cascade className="gradient-card-header white">
            <Bar data={barChartData} options={barChartOptions} height={150} />
          </MDBView>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
};

export default Transactions;

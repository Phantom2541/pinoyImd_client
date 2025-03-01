import React from "react";
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

const barChartData = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2],
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

const Transactions = () => {
  return (
    <MDBCard cascade narrow>
      <MDBRow>
        <MDBCol xl="5" md="12" className="mr-0">
          <MDBView
            cascade
            className="gradient-card-header light-blue lighten-1"
          >
            <h4 className="h4-responsive mb-0 font-weight-bold">Traffic</h4>
          </MDBView>
          <MDBCardBody cascade className="pb-3">
            <MDBRow className="pt-3 card-body">
              <MDBCol md="12">
                <h4>
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

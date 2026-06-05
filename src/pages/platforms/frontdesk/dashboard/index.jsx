import React, { useEffect, useMemo, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBIcon,
  MDBBadge,
  MDBProgress,
  MDBBtn,
  MDBTable,
  MDBView,
} from "mdbreact";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Services } from "../../../../services/fakeDb";
import { SERVICE_CENSUS } from "../../../../services/redux/slices/finance/bookkeeping/remittances";

const MONTH_LABELS = [
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

export default function Dashboard() {
  const dispatch = useDispatch();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { token, auth = {}, branches = [] } = useSelector(({ auth }) => auth);
  const {
    serviceCensus = [],
    serviceCensusSummary = {
      current: { opdWi: 0, insources: 0, outsources: 0, purchases: 0 },
      previous: { opdWi: 0, insources: 0, outsources: 0, purchases: 0 },
    },
    isLoading: censusLoading,
  } = useSelector(({ remittances }) => remittances);

  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = branches.find(
      ({ affiliationId, _id }) =>
        String(affiliationId || _id) === String(auth?.activeAffiliation || ""),
    );

    return matchedAffiliation || (branches.length === 1 ? branches[0] : {});
  }, [branches, auth?.activeAffiliation]);

  const branchId =
    currentAffiliation?.branch?._id ||
    currentAffiliation?.branchId ||
    currentAffiliation?.branch ||
    "";

  useEffect(() => {
    if (!token || !branchId || !selectedMonth || !selectedYear) return;

    dispatch(
      SERVICE_CENSUS({
        token,
        key: {
          branchId,
          month: selectedMonth,
          year: selectedYear,
        },
      }),
    );
  }, [branchId, dispatch, selectedMonth, selectedYear, token]);

  const barChartData = useMemo(
    () => ({
      labels: serviceCensus.map(
        ({ serviceId, description }) =>
          Services.getAbbr(serviceId) ||
          Services.getName(serviceId) ||
          description ||
          `Service #${serviceId}`,
      ),
      datasets: [
        {
          label: `${MONTH_LABELS[selectedMonth - 1]} ${selectedYear} Service Census`,
          data: serviceCensus.map(({ count }) => count),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [selectedMonth, selectedYear, serviceCensus],
  );

  const totalAvailedServices = useMemo(
    () => serviceCensus.reduce((total, { count = 0 }) => total + count, 0),
    [serviceCensus],
  );

  const rankedServices = useMemo(
    () =>
      serviceCensus.map((service, index) => ({
        rank: index + 1,
        label:
          Services.getAbbr(service.serviceId) ||
          Services.getName(service.serviceId) ||
          service.description ||
          `Service #${service.serviceId}`,
        serviceName:
          Services.getName(service.serviceId) ||
          service.description ||
          `Service #${service.serviceId}`,
        ...service,
      })),
    [serviceCensus],
  );

  const widgetCards = useMemo(
    () => [
      {
        key: "opdWi",
        color: "primary",
        icon: "stethoscope",
        label: "OPD / WI",
      },
      {
        key: "insources",
        color: "warning",
        icon: "clinic-medical",
        label: "Referrals",
      },
      {
        key: "outsources",
        color: "info",
        icon: "share-alt",
        label: "Outsourced",
      },
      {
        key: "purchases",
        color: "danger",
        icon: "users",
        label: "Patients",
      },
    ],
    [],
  );

  return (
    <MDBContainer fluid id="v6" className="mb-5">
      <section className="mb-4">
        <MDBRow>
          {widgetCards.map(({ key, color, icon, label }) => {
            const currentValue = serviceCensusSummary?.current?.[key] || 0;
            const previousValue = serviceCensusSummary?.previous?.[key] || 0;

            return (
              <MDBCol key={key} xl="3" md="6" className="mb-4 mb-r">
                <MDBCard>
                  <MDBRow className="mt-3">
                    <MDBCol md="3" size="3" className="text-left pl-4">
                      <MDBBtn
                        tag="a"
                        floating
                        size="lg"
                        color={color}
                        className="ml-4"
                        style={{ padding: 0 }}
                      >
                        <MDBIcon icon={icon} size="2x" />
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol md="9" col="9" className="text-right pr-5">
                      <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
                        {censusLoading ? "..." : currentValue.toLocaleString()}
                      </h5>
                      <p className="font-small grey-text">{label}</p>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="my-3">
                    <MDBCol md="7" col="7" className="text-left pl-4">
                      <p className="font-small dark-grey-text font-up ml-4 font-weight-bold">
                        Last month
                      </p>
                    </MDBCol>
                    <MDBCol md="5" col="5" className="text-right pr-5">
                      <p className="font-small grey-text">
                        {censusLoading ? "..." : previousValue.toLocaleString()}
                      </p>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
      </section>
      <section className="mb-5">
        <MDBCard cascade narrow>
          <MDBRow>
            <MDBCol xl="5" md="12" className="mr-0">
              <MDBView
                cascade
                className="gradient-card-header light-blue lighten-1"
              >
                <h4 className="h4-responsive mb-0 font-weight-bold">
                  Services Census
                </h4>
              </MDBView>
              <MDBCardBody cascade className="pb-3">
                <MDBRow className="pt-3 card-body">
                  <MDBCol md="12">
                    <h4>
                      <MDBBadge className="big-badge light-blue lighten-1">
                        Census month
                      </MDBBadge>
                    </h4>
                    <select
                      className="form-control mb-3"
                      value={selectedMonth}
                      onChange={({ target }) =>
                        setSelectedMonth(Number(target.value))
                      }
                    >
                      {MONTH_LABELS.map((label, index) => (
                        <option key={label} value={index + 1}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <h4>
                      <MDBBadge className="big-badge light-blue lighten-1">
                        Census year
                      </MDBBadge>
                    </h4>
                    <select
                      className="form-control"
                      value={selectedYear}
                      onChange={({ target }) =>
                        setSelectedYear(Number(target.value))
                      }
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <h5>
                      <MDBBadge className="big-badge light-blue lighten-1">
                        Current branch
                      </MDBBadge>
                    </h5>
                    <br />
                    <div className="mb-1">
                      <p className="grey-text mb-0">
                        {currentAffiliation?.branch?.displayname ||
                          currentAffiliation?.branch?.name ||
                          currentAffiliation?.displayname ||
                          currentAffiliation?.name ||
                          "No active branch selected"}
                      </p>
                      <small className="grey-text">
                        {censusLoading
                          ? "Loading monthly availed services..."
                          : `Showing availed services for ${MONTH_LABELS[selectedMonth - 1]} ${selectedYear}.`}
                      </small>
                      <p className="mt-3 mb-0 font-weight-bold">
                        Total availed services:{" "}
                        {totalAvailedServices.toLocaleString()}
                      </p>
                      <small className="grey-text">
                        Counts are based on services/tests availed, not gross
                        sales.
                      </small>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCol>
            <MDBCol md="12" xl="7">
              <MDBView cascade className="gradient-card-header white">
                <Bar
                  data={barChartData}
                  options={barChartOptions}
                  height={150}
                />
              </MDBView>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </section>
      <section>
        <MDBRow>
          <MDBCol lg="4" md="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable responsive>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Service</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Code</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Census</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedServices.length > 0 ? (
                      rankedServices.map(
                        ({ label, serviceName, count, serviceId }, index) => (
                          <tr key={`${serviceId}-${index}`}>
                            <td>{serviceName || "Unnamed service"}</td>
                            <td>{label || "-"}</td>
                            <td>{count}</td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center grey-text">
                          {censusLoading
                            ? "Loading services census..."
                            : "No service census available yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8" md="12">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBTable>
                  <thead>
                    <tr>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Rank</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Service</strong>
                      </th>
                      <th className="font-weight-bold dark-grey-text">
                        <strong>Count</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedServices.length > 0 ? (
                      rankedServices.map(
                        ({ rank, serviceName, count, serviceId }) => (
                          <tr key={`${serviceId}-${rank}`}>
                            <td>{rank}</td>
                            <td>{serviceName || "Unnamed service"}</td>
                            <td>{count.toLocaleString()}</td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center grey-text">
                          {censusLoading
                            ? "Loading services census..."
                            : "No availed services found for this period."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
}

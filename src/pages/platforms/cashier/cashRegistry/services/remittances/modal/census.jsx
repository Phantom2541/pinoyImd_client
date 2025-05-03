import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCardBody,
} from "mdbreact";
import {
  TOGGLE,
  CENSUS,
} from "./../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { currency } from "./../../../../../../../services/utilities";
import { Services } from "../../../../../../../services/fakeDb";

export default function Census() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { showCensus, selected, deals } = useSelector(
      ({ remittances }) => remittances
    ),
    { collections: payments } = useSelector(({ payments }) => payments),
    { collections } = useSelector(({ menus }) => menus),
    [census, setCensus] = useState({ menus: [], services: [] }),
    [patients, setPatients] = useState(0),
    [gross, setGross] = useState(0),
    [breakdown, setBreakdown] = useState({}),
    [activeTab, setActiveTab] = useState("menus"),
    dispatch = useDispatch();
  console.log("payments", payments);

  useEffect(() => {
    let isMounted = true;
    if (selected?.census && selected?.census?.menus.length > 0) {
      setCensus(selected.census);
      setPatients(selected.patients);
      setGross(selected.gross);
      return;
    }

    const fetchCensus = async () => {
      try {
        if (deals.length > 0) {
          setPatients(deals?.length);
          const menuCountMap = {};
          const serviceCountMap = {};
          const paymentSummary = {};

          setGross(deals.reduce((acc, item) => acc + item.amount, 0));

          deals.forEach(({ cart, amount, payment }) => {
            if (payment && amount) {
              if (!paymentSummary[payment]) {
                paymentSummary[payment] = 0;
              }
              paymentSummary[payment] += amount;
            }

            cart.forEach(({ menuId, packages }) => {
              if (menuId?._id) {
                menuCountMap[menuId._id] = (menuCountMap[menuId._id] || 0) + 1;
              }

              packages.forEach((serviceId) => {
                serviceCountMap[serviceId] =
                  (serviceCountMap[serviceId] || 0) + 1;
              });
            });
          });

          if (isMounted) {
            setCensus({
              menus: menuCountMap,
              services: serviceCountMap,
            });
            setBreakdown(paymentSummary);
          }
        }
      } catch (error) {
        console.error("Failed to fetch census:", error);
      }
    };

    if (selected?.createdAt) fetchCensus();

    return () => {
      isMounted = false;
    };
  }, [selected, token, activePlatform, auth, dispatch, deals]);

  const censusDate = selected?.createdAt
    ? new Date(selected.createdAt).toLocaleDateString("en-PH") // 'YYYY-MM-DD' in local time
    : "N/A";

  const paymentsSum = payments
    .filter(
      ({ createdAt, amount }) =>
        createdAt &&
        new Date(createdAt).toLocaleDateString("en-PH") === censusDate &&
        amount
    )
    .reduce((sum, { amount }) => sum + Number(amount), 0);

  const handleSubmit = () => {
    const { opening } = selected;
    const data = {
      _id: selected._id,
      census,
      breakdown,
      patients,
      sales: gross,
      collections: breakdown.cash + opening.sum - paymentsSum,
      expenses: paymentsSum,
    };

    dispatch(CENSUS({ token, data }));
    dispatch(TOGGLE({ key: "census" }));
  };

  const tabStyle = (tab) =>
    `w-50 ${activeTab === tab ? "btn-primary" : "btn-outline-primary"}`;

  return (
    <MDBModal
      isOpen={showCensus}
      toggle={() => dispatch(TOGGLE({ key: "census" }))}
      size="lg"
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE({ key: "census" }))}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar-alt" className="mr-2" />
        Census : {censusDate}
      </MDBModalHeader>

      {!selected && (
        <p className="font-weight-bold text-danger">
          Please declare your floating cash before proceeding with the census.
        </p>
      )}

      <MDBModalBody className="mb-0">
        <MDBRow className="align-items-center mb-3">
          {[
            {
              icon: "chart-line",
              text: "Gross Sales",
              value: currency(gross),
              color: "text-success",
            },
            {
              icon: "money-bill-wave",
              text: "Expenses",
              value: currency(paymentsSum),
              color: "text-danger",
            },
            {
              icon: "user-injured",
              text: "Patients",
              value: patients,
              color: "text-primary",
            },
          ].map(({ icon, text, value, color }, index) => (
            <MDBCol
              key={index}
              size="4"
              className={index === 2 ? "text-right" : ""}
            >
              <h6 className="mb-0">
                <MDBIcon icon={icon} className={`${color} mr-2`} />
                {text}: <strong>{value}</strong>
              </h6>
            </MDBCol>
          ))}
        </MDBRow>

        <div className="mb-3 d-flex">
          <MDBBtn
            className={tabStyle("menus")}
            onClick={() => setActiveTab("menus")}
          >
            Menus
          </MDBBtn>
          <MDBBtn
            className={tabStyle("services")}
            onClick={() => setActiveTab("services")}
          >
            Services
          </MDBBtn>
        </div>

        {/* Menus Table */}
        {activeTab === "menus" && (
          <MDBTable bordered small>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Test</th>
                <th>Count</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {Object.entries(census.menus).map(([id, count], idx) => {
                const abbreviation =
                  collections.find(({ _id }) => _id === id)?.abbreviation || id;
                return (
                  <tr key={id}>
                    <td>{idx + 1}</td>
                    <td>{abbreviation}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        )}

        {/* Services Table */}
        {activeTab === "services" && (
          <MDBTable bordered small>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Count</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {Object.entries(census.services).map(([id, count], idx) => {
                const name = Services.getName(id);
                return (
                  <tr key={id}>
                    <td>{idx + 1}</td>
                    <td>{name}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        )}
      </MDBModalBody>

      <MDBCardBody>
        {!!selected && (
          <MDBBtn
            className="w-100"
            color="primary"
            size="sm"
            rounded
            onClick={handleSubmit}
          >
            <strong>Submit</strong>
          </MDBBtn>
        )}
      </MDBCardBody>
    </MDBModal>
  );
}

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
  MDBCollapse,
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
import { CASHIER } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";

export default function Census() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { showCensus, selected } = useSelector(({ remittances }) => remittances),
    { collections } = useSelector(({ menus }) => menus),
    [census, setCensus] = useState({ menus: [], services: [] }),
    [collapsed, setCollapsed] = useState({ menus: false, services: false }),
    [patients, setPatients] = useState(0),
    [gross, setGross] = useState(0),
    [breakdown, setBreakdown] = useState({}),
    [expenses, setExpenses] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // ✅ Track if component is mounted
    // if already saved
    if (selected?.census && selected?.census?.menus.length > 0) {
      setCensus(selected.census);
      setPatients(selected.patients);
      setGross(selected.gross);
      setExpenses(selected.expenses);
      return; // ✅ Prevent unnecessary API call
    }

    // if census is not saved then, fetched to deals
    const fetchCensus = async () => {
      try {
        const date = new Date(selected.createdAt).toISOString().split("T")[0];
        const { payload } = await dispatch(
          CASHIER({
            token,
            key: {
              branchId: activePlatform?.branchId,
              cashierId: auth._id,
              date,
            },
          })
        );

        // console.log("📡 Calling API with payload:", payload);

        if (!isMounted) return; // ✅ Stop execution if unmounted

        if (payload?.payload) {
          const _patient = payload.payload?.length;
          setPatients(_patient);

          const menuCountMap = {}; // { menuId: count }
          const serviceCountMap = {}; // { serviceId: count }
          const paymentSummary = {};

          setGross(payload.payload.reduce((acc, item) => acc + item.amount, 0));

          payload.payload.forEach(({ cart, amount, payment }) => {
            // Payment Breakdown
            if (payment && amount) {
              if (!paymentSummary[payment]) {
                paymentSummary[payment] = 0;
              }
              paymentSummary[payment] += amount;
            }

            cart.forEach(({ menuId, packages }) => {
              // Count Menus
              if (menuId?._id) {
                menuCountMap[menuId._id] = (menuCountMap[menuId._id] || 0) + 1;
              }

              // Count Services
              packages.forEach((serviceId) => {
                serviceCountMap[serviceId] =
                  (serviceCountMap[serviceId] || 0) + 1;
              });
            });
          });

          console.log("menuCountMap", menuCountMap);
          console.log("serviceCountMap", serviceCountMap);

          if (isMounted) {
            setCensus({
              menus: menuCountMap, // {10:2, 5:1}
              services: serviceCountMap, // {20:3, 15:2}
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
      isMounted = false; // ✅ Cleanup to prevent memory leak
    };
  }, [selected, token, activePlatform, auth, dispatch]);

  const toggleCollapse = (section) =>
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));

  const handleSubmit = () => {
    const data = {
      _id: selected._id,
      census,
      breakdown,
      patients,
      gross,
    };

    dispatch(CENSUS({ token, data }));
    dispatch(TOGGLE({ key: "census" }));
  };

  const censusDate = selected?.createdAt
    ? new Date(selected.createdAt).toISOString().split("T")[0]
    : "N/A";

  return (
    <MDBModal
      isOpen={showCensus}
      toggle={() => dispatch(TOGGLE({ key: "census" }))}
      size="lg"
      backdrop
    >
      {/* Modal Header */}
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
      {/* Modal Body */}
      <MDBModalBody className="mb-0">
        {/* Summary Section */}
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
              value: currency(expenses),
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

        {/* Collapsible Sections */}
        {[
          {
            label: "Menus",
            key: "menus",
            data: Object.entries(census.menus).map(([id, count]) => ({
              _id: id,
              abbreviation: collections.find(({ _id }) => _id === id)
                ?.abbreviation, // Assuming you have a function to get the menu name
              // abbreviation: id,
              count,
            })),
            columns: ["Test", "Count"],
            accessor: (item) => [item.abbreviation, item.count],
          },
          {
            label: "Services",
            key: "services",
            data: Object.entries(census.services).map(([id, count]) => ({
              _id: id,
              name: Services.getName(id),
              count,
            })),
            columns: ["Service", "Count"],
            accessor: (item) => [item.name, item.count],
          },
        ].map(({ label, key, data, columns, accessor }) => (
          <div key={key} className="mb-2">
            <MDBBtn
              color={key === "menus" ? "primary" : "secondary"}
              onClick={() => toggleCollapse(key)}
              block
            >
              {label}{" "}
              <MDBIcon icon={collapsed[key] ? "chevron-up" : "chevron-down"} />
            </MDBBtn>
            <MDBCollapse isOpen={collapsed[key]}>
              <MDBTable bordered small>
                <MDBTableHead>
                  <tr>
                    <th>#</th>
                    {columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {data.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      {accessor(item).map((value, idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCollapse>
          </div>
        ))}
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

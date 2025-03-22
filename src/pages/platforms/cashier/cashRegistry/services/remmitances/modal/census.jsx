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
    [census, setCensus] = useState({ menus: [], services: [] }),
    [collapsed, setCollapsed] = useState({ menus: false, services: false }),
    [menuCensus, setMenuCensus] = useState([]), // Menus Census for display
    [serviceCensus, setServiceCensus] = useState([]), // Services Census for display
    [patients, setPatients] = useState(0),
    [gross, setGross] = useState(0),
    [breakdown, setBreakdown] = useState({}),
    [expenses, setExpenses] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // ✅ Track if component is mounted

    if (selected?.census) {
      setCensus(selected.census);
      setPatients(selected.patients);
      setGross(selected.gross);
      setExpenses(selected.expenses);
      return; // ✅ Prevent unnecessary API call
    }

    const fetchCensus = async () => {
      try {
        const { payload } = await dispatch(
          CASHIER({
            token,
            key: {
              branchId: activePlatform?.branchId,
              cashierId: auth._id,
              date: new Date(selected.createdAt).toISOString().split("T")[0],
            },
          })
        );

        // console.log("📡 Calling API with payload:", payload);

        if (!isMounted) return; // ✅ Stop execution if unmounted

        if (payload?.payload) {
          const _patient = payload.payload?.length;
          setPatients(_patient);
          const menuCountMap = {}; // { menuId: { _id, abbreviation, count } }
          const serviceCountMap = {}; // { serviceId: { _id, count } }

          setGross(payload.payload.reduce((acc, item) => acc + item.amount, 0));
          const paymentSummary = {};
          payload.payload.forEach(({ cart, amount, payment }) => {
            if (payment && amount) {
              if (!paymentSummary[payment]) {
                paymentSummary[payment] = 0;
              }
              paymentSummary[payment] += amount;
            }
            cart.forEach(({ menuId, packages }) => {
              // Count Menus
              if (menuId) {
                const { _id, abbreviation } = menuId;
                if (!menuCountMap[_id]) {
                  menuCountMap[_id] = { _id, abbreviation, count: 0 };
                }
                menuCountMap[_id].count += 1;
              }
              // Count Services
              packages.forEach((serviceId) => {
                if (!serviceCountMap[serviceId]) {
                  serviceCountMap[serviceId] = { _id: serviceId, count: 0 };
                }
                serviceCountMap[serviceId].count += 1;
              });
            });
          });

          if (isMounted) {
            setMenuCensus(Object.values(menuCountMap)); // ✅ Show menu abbreviations
            setServiceCensus(Object.values(serviceCountMap)); // ✅ Show service IDs
            setCensus({
              menus: Object.values(menuCountMap),
              services: Object.values(serviceCountMap),
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
      census: {
        menus: menuCensus,
        services: serviceCensus,
      },
      breakdown,
      patients,
      gross,
    };

    dispatch(CENSUS({ token, data }));
    dispatch(TOGGLE({ key: "census" }));
  };
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
        Census
      </MDBModalHeader>

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
            data: census.menus,
            columns: ["Test", "Count"],
            accessor: (item) => [item.abbreviation, item.count],
          },
          {
            label: "Services",
            key: "services",
            data: census.services,
            columns: ["Service", "Count"],
            accessor: (item) => [Services.getName(item._id), item.count],
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
        {!selected?.census && (
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

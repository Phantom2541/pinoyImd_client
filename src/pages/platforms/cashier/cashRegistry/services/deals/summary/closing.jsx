import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBBtn,
  MDBCollapse,
} from "mdbreact";
import { CENSUS } from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import SummaryLoading from "./loading";
import { Services } from "../../../../../../../services/fakeDb";
import { useToasts } from "react-toast-notifications";

export default function Vouchers() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, total, isLoading } = useSelector(({ deals }) => deals),
    { selected } = useSelector(({ remittances }) => remittances),
    [menuCensus, setMenuCensus] = useState([]),
    [serviceCensus, setServiceCensus] = useState([]),
    [breakdown, setBreakdown] = useState({}),
    [activeTab, setActiveTab] = useState("menus"),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (collections && collections.length > 0 && !isLoading) {
      const menuCountMap = {};
      const serviceCountMap = {};
      const paymentSummary = {};

      collections.forEach(({ cart, amount, payment }) => {
        if (payment && amount) {
          if (!paymentSummary[payment]) {
            paymentSummary[payment] = 0;
          }
          paymentSummary[payment] += amount;
        }

        cart?.forEach(({ menuId, packages }) => {
          const { _id, abbreviation } = menuId;
          if (!menuCountMap[_id]) {
            menuCountMap[_id] = { _id, abbreviation, count: 0 };
          }
          menuCountMap[_id].count += 1;

          packages.forEach((id) => {
            if (!serviceCountMap[id]) {
              serviceCountMap[id] = 0;
            }
            serviceCountMap[id] += 1;
          });
        });
      });

      setBreakdown(paymentSummary);
      setMenuCensus(Object.values(menuCountMap));
      setServiceCensus(serviceCountMap);
    }
  }, [collections, isLoading]);

  const handleSubmit = () => {
    if (!selected) {
      alert("Please set a floating cash first.");
      return;
    }

    const menus = menuCensus.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    const data = {
      _id: selected._id,
      census: {
        menus,
        services: serviceCensus,
      },
      breakdown,
      patient: collections.length,
      gross: total,
    };

    dispatch(CENSUS({ token, data })).then(() => {
      addToast("End-of-Shift Summary saved successfully.", {
        appearance: "success",
      });
    });
  };

  return (
    <MDBCard className="shadow-sm">
      <MDBCardBody>
        <h6 className="text-uppercase font-weight-bold text-primary text-center ">
          End-of-Shift Summary
        </h6>

        <MDBNav pills color="primary" className="nav-justified">
          <MDBNavItem>
            <MDBNavLink
              to="#!"
              active={activeTab === "menus"}
              onClick={() => setActiveTab("menus")}
            >
              Menus
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem>
            <MDBNavLink
              to="#!"
              active={activeTab === "services"}
              onClick={() => setActiveTab("services")}
            >
              Services
            </MDBNavLink>
          </MDBNavItem>
        </MDBNav>

        {/* Menus Tab */}
        <MDBCollapse isOpen={activeTab === "menus"}>
          <MDBCardBody>
            {!isLoading ? (
              menuCensus.length > 0 ? (
                <ul className="list-group mb-3">
                  {menuCensus.map(({ _id, abbreviation, count }) => (
                    <li
                      key={_id}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <span>{abbreviation}</span>
                      <strong className="text-primary">{count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No menu items found.</p>
              )
            ) : (
              <SummaryLoading />
            )}
          </MDBCardBody>
        </MDBCollapse>

        {/* Services Tab */}
        <MDBCollapse isOpen={activeTab === "services"}>
          <MDBCardBody>
            {!isLoading ? (
              Object.keys(serviceCensus).length > 0 ? (
                <ul className="list-group mb-3">
                  {Object.entries(serviceCensus).map(([key, count], idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <span>{Services.getAbbr(key) || `Service #${key}`}</span>
                      <strong className="text-primary">{count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No services found.</p>
              )
            ) : (
              <SummaryLoading />
            )}
          </MDBCardBody>
        </MDBCollapse>

        {collections.length > 0 && (
          <MDBBtn
            className="w-100"
            color="primary"
            size="sm"
            rounded
            onClick={handleSubmit}
            disabled={menuCensus.length === 0}
          >
            <strong>Submit</strong>
          </MDBBtn>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}

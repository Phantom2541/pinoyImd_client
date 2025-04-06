import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapseHeader,
  MDBCollapse,
  MDBBtn,
} from "mdbreact";
import { CENSUS } from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import SummaryLoading from "./loading";
import { Services } from "../../../../../../../services/fakeDb";
import { useToasts } from "react-toast-notifications";
// import _ from "lodash";

export default function Vouchers() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, total, isLoading } = useSelector(({ deals }) => deals),
    { selected } = useSelector(({ remittances }) => remittances),
    [isOpen, setIsOpen] = useState(false),
    [menuCensus, setMenuCensus] = useState([]), // Menus Census for display
    [serviceCensus, setServiceCensus] = useState([]), // Services Census for display
    [activePage, setActivePage] = useState("menus"),
    [breakdown, setBreakdown] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // console.log("collections", collections);

  useEffect(() => {
    if (collections && collections.length > 0 && !isLoading) {
      const menuCountMap = {}; // { menuId: { _id, abbreviation, count } }
      const serviceCountMap = {}; // {  [_id]: count }
      const paymentSummary = {};

      collections.forEach(({ cart, amount, payment }) => {
        // <-- FIXED!
        if (payment && amount) {
          if (!paymentSummary[payment]) {
            paymentSummary[payment] = 0;
          }
          paymentSummary[payment] += amount;
        }

        cart.forEach(({ menuId, packages }) => {
          // Count Menus
          const { _id, abbreviation } = menuId;
          if (!menuCountMap[_id]) {
            menuCountMap[_id] = { _id, abbreviation, count: 0 };
          }
          menuCountMap[_id].count += 1;

          // Count Services (Extract from packages)
          packages.forEach((id) => {
            if (!serviceCountMap[id]) {
              serviceCountMap[id] = 0;
            }
            serviceCountMap[id] += 1;
          });
        });
      });

      setBreakdown(paymentSummary);
      setMenuCensus(Object.values(menuCountMap)); // Show menu abbreviations
      setServiceCensus(serviceCountMap); // Show service IDs
    }
  }, [collections, isLoading]); // Re-run if collections change

  const handleActivePage = (page) =>
    setActivePage(activePage === page ? "close" : page);
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
      // expenses: 735,
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
      <MDBCollapseHeader style={{ borderRadius: "50%" }} className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-uppercase font-weight-bold text-center text-primary">
            End-of-Shift Summary
          </small>
          <i
            onClick={() => setIsOpen(!isOpen)}
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all "
          />
        </div>
      </MDBCollapseHeader>
      <MDBCollapse isOpen={isOpen}>
        <MDBCardBody>
          {/* Menu Census */}
          <MDBCollapseHeader
            onClick={() => handleActivePage("menus")}
            className="bg-light px-2"
          >
            <strong>Menus</strong>
            <i
              className={`fa fa-angle-${
                activePage === "menus" ? "down" : "right"
              } float-right`}
            />
          </MDBCollapseHeader>
          <MDBCollapse isOpen={activePage === "menus"}>
            <MDBCardBody>
              {!isLoading ? (
                <>
                  {menuCensus.length > 0 ? (
                    <ul className="list-group">
                      {menuCensus.map(({ _id, abbreviation, count }) => (
                        <li
                          key={_id}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>{abbreviation}</span> :
                          <strong className="text-primary">{count}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No menu items found.</p>
                  )}
                </>
              ) : (
                <SummaryLoading />
              )}
            </MDBCardBody>
          </MDBCollapse>

          {/* Services Census */}
          <MDBCollapseHeader
            onClick={() => handleActivePage("services")}
            className="bg-light px-2 mt-2"
          >
            <strong>Services</strong>
            <i
              className={`fa fa-angle-${
                activePage === "services" ? "down" : "right"
              } float-right`}
            />
          </MDBCollapseHeader>
          <MDBCollapse isOpen={activePage === "services"}>
            <MDBCardBody>
              {!isLoading ? (
                <>
                  {serviceCensus && Object.keys(serviceCensus).length > 0 ? (
                    <ul className="list-group">
                      {Object.entries(serviceCensus).map(
                        ([key, count], index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between"
                          >
                            <span>
                              {Services.getAbbr(key) || `Service #${key}`}
                            </span>
                            :<strong className="text-primary">{count}</strong>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted">No services found.</p>
                  )}
                </>
              ) : (
                <SummaryLoading />
              )}
            </MDBCardBody>
          </MDBCollapse>

          <MDBCardBody>
            {collections.length > 0 && (
              <MDBBtn
                className="w-100"
                color="primary"
                size="sm"
                rounded
                onClick={handleSubmit}
                disabled={!!menuCensus ? false : true} // Prevent submit if no data
              >
                <strong>Submit</strong>
              </MDBBtn>
            )}
          </MDBCardBody>
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}

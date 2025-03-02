import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CASHIER,
  RESET,
} from "../../../../../services/redux/slices/commerce/sales";
import {
  currency,
  fullName,
  // globalSearch,
} from "../../../../../services/utilities";
import { capitalize } from "lodash";
import { Categories } from "../../../../../services/fakeDb";
import CashRegister from "../cashierOld/pos";

import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBIcon,
  MDBBadge,
} from "mdbreact";

export default function Sales() {
  const [sales, setSales] = useState([]),
    [view, setView] = useState("all"),
    [total, setTotal] = useState(0),
    [selected, setSelected] = useState({}),
    [showCashRegister, setShowCashRegister] = useState(false),
    // hiding optional items in table head to conserve UI design and avoid crumpled view
    [showSources, setShowSources] = useState(false), // show sources in table head if set to true
    [showPhysicians, setShowPhysicians] = useState(false), // show physicians in table head if set to true
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, transaction } = useSelector(({ sales }) => sales),
    dispatch = useDispatch();

  console.log(
    "unused variable showSources,showPhysicians,setView",
    showSources,
    showPhysicians,
    setView
  );

  //Initial CASHIER
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const today = new Date().setHours(0, 0, 0, 0); //date and time today starting from 00:00 AM

      dispatch(
        CASHIER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            cashierId: auth._id,
            date: today,
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const sales =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);

      // if any items inside sales has sourceKeyAsDeclared value, show sources in table head
      if (sales.find((s) => s.physicianId)) setShowPhysicians(true);
      if (sales.find((s) => s.source)) setShowSources(true);

      setTotal(sales.reduce((a, c) => a + c.amount, 0));
      setSales(sales);
    }
  }, [collections, view]);

  //Modal toggle
  const toggleCashRegister = () => setShowCashRegister(!showCashRegister);

  //Search function
  //comment by darrel
  // const handleSearch = async (willSearch, key) => {
  //   if (willSearch) {
  //     setView("all");
  //     setSales(globalSearch(collections, key));
  //   } else {
  //     setSales(collections);
  //   }
  // };

  const generateStub = (sale) => ({
    ...sale,
    customer: {
      fullName: sale.customerId?.fullName,
      address: `${
        sale.customerId?.address?.barangay &&
        `${sale.customerId?.address?.barangay}, `
      }${sale.customerId?.address?.city}`,
    },
    cashier: sale.cashierId?.fullName,
    cart: sale.cart,
  });

  const handleView = (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    window.open(
      "/printout/claimstub",
      "Claim Stub",
      "top=100px,left=150px,width=450px,height=850px"
    );
  };

  const handleCashRegister = (selected) => {
    setSelected({
      ...selected.customerId,
      category: selected.category,
      saleId: selected._id,
      soldCart: selected.cart,
    });
    toggleCashRegister();
  };

  return (
    <>
      <MDBCard>
        <MDBCardHeader className="d-flex justify-content-between">
          <h5>{`${
            view === "all" ? `Sales Summaries` : capitalize(view)
          } :  ${currency(total)} @ ${sales.length} Patient/s`}</h5>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Physician</th>
                <th>Amount</th>
                <th>Services</th>
              </tr>
            </thead>
            <tbody>
              {sales?.map((sale, index) => {
                //console.log(sale);
                return (
                  <tr key={`sales-${index + 1}`}>
                    <td>{index + 1}.</td>
                    <td>
                      <h6>{fullName(sale?.customerId?.fullName)}</h6>
                      <small>
                        {capitalize(
                          sale.category === "walkin"
                            ? sale.category
                            : Categories.find(
                                ({ abbr }) => abbr === sale.category
                              ).name
                        )}
                        @ {new Date(sale.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      <h6>
                        {sale.physicianId?.fullName.lname && (
                          <h6>Dr. {sale.physicianId.fullName.lname}</h6>
                        )}
                      </h6>
                      <p>{sale.source?.companyName}</p>
                    </td>
                    <td>
                      <h6>{currency(sale.amount)}</h6>

                      <p>
                        {sale.payment}
                        <MDBIcon
                          icon="receipt"
                          className="mr-2"
                          title="Print Reciept"
                          onClick={() => handleView(sale)}
                        />
                      </p>
                    </td>

                    <td>
                      {sale.cart?.map((menu) => (
                        <MDBBadge key={menu.referenceId} className="mx-1">
                          {menu?.abbreviation}
                        </MDBBadge>
                      ))}

                      <MDBIcon
                        icon="plus"
                        className="mr-2"
                        title="Add"
                        onClick={() => handleCashRegister(sale)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>
      <CashRegister
        key={transaction._id}
        show={showCashRegister}
        toggle={toggleCashRegister}
        patient={selected}
      />
    </>
  );
}

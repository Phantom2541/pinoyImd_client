import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "lodash";
import { MDBTable, MDBIcon, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Categories } from "../../../../../../services/fakeDb";
import {
  SetTOTAL,
  SetFILTERED,
  SetSELECTED,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";

const Tables = () => {
  const [showCashRegister, setShowCashRegister] = useState(false),
    { collections, filtered, view = "all" } = useSelector(({ deals }) => deals),
    /**
     * show  in table head if set to true
     */
    // [showSources, setShowSources] = useState(false),
    // [showPhysicians, setShowPhysicians] = useState(false),
    dispatch = useDispatch();

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const _deals =
        view === "all"
          ? collections
          : collections.filter(({ perform }) => perform === view);

      // if any items inside deals has sourceKeyAsDeclared value, show sources in table head
      // if (_deals.find((s) => s.physicianId)) setShowPhysicians(true);
      // if (_deals.find((s) => s.source)) setShowSources(true);

      dispatch(SetTOTAL(_deals.reduce((a, c) => a + c.amount, 0)));
      dispatch(SetFILTERED(_deals));
    }
  }, [collections, view, dispatch]);

  const handleView = (selected) => {
    localStorage.setItem("claimStub", JSON.stringify(generateStub(selected)));
    window.open(
      "/printout/claimstub",
      "Claim Stub",
      "top=100px,left=150px,width=450px,height=850px"
    );
  };

  const handleCashRegister = (selected) => {
    dispatch(
      SetSELECTED({
        ...selected.customerId,
        category: selected.category,
        saleId: selected._id,
        soldCart: selected.cart,
      })
    );
  };

  const generateStub = (deal) => ({
    ...deal,
    customer: {
      fullName: deal.customerId?.fullName,
      address: `${
        deal.customerId?.address?.barangay &&
        `${deal.customerId?.address?.barangay}, `
      }${deal.customerId?.address?.city}`,
    },
    cashier: deal.cashierId?.fullName,
    cart: deal.cart,
  });

  return (
    <MDBTable responsive hover bordered>
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
        {filtered?.map((deal, index) => {
          return (
            <tr key={`deals-${index + 1}`}>
              <td>{index + 1}.</td>
              <td>
                <h6>{fullName(deal?.customerId?.fullName)}</h6>
                <small>
                  {capitalize(
                    deal?.category === "walkin"
                      ? deal?.category
                      : Categories.find(({ abbr }) => abbr === deal?.category)
                          .name
                  )}
                  @ {new Date(deal?.createdAt).toLocaleTimeString()}
                </small>
              </td>
              <td>
                <h6>
                  {deal.physicianId?.fullName.lname &&
                    `Dr. ${deal.physicianId.fullName.lname}`}
                </h6>

                <p>{deal.source?.companyName}</p>
              </td>
              <td>
                <h6>{currency(deal.amount)}</h6>

                <p>
                  {deal.payment}
                  <MDBIcon
                    icon="receipt"
                    className="mr-2"
                    title="Print Reciept"
                    onClick={() => handleView(deal)}
                  />
                </p>
              </td>

              <td>
                {deal.cart?.map((menu) => (
                  <MDBBadge key={menu.referenceId} className="mx-1">
                    {menu?.abbreviation}
                  </MDBBadge>
                ))}

                <MDBIcon
                  icon="plus"
                  className="mr-2"
                  title="Add"
                  onClick={() => handleCashRegister(deal)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Tables;

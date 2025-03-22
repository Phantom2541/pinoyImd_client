import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "lodash";
import {
  MDBTable,
  MDBIcon,
  MDBBadge,
  MDBBtnGroup,
  MDBBtn,
  MDBCard,
} from "mdbreact";
import {
  currency,
  fullName,
  getGenderIcon,
} from "../../../../../../../services/utilities";
import { Categories } from "../../../../../../../services/fakeDb";
import {
  SetTOTAL,
  SetFILTERED,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import utils from "./utils";

const Tables = () => {
  const {
      collections,
      filtered,
      total,
      view = "all",
    } = useSelector(({ deals }) => deals),
    [didHoverID, setDidHoverID] = useState(-1),
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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginTop: "-1.4rem",
        }}
      >
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          {currency(total)}
        </p>
        <div style={{ flex: 1, borderBottom: "1px dashed black" }}></div>
        <p style={{ fontSize: "1.5rem", margin: "0 10px" }}>
          @ {filtered.length} Patient/s
        </p>
      </div>
      <MDBTable responsive hover>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Physician</th>
            <th>Amount</th>
            <th className="text-center">Services</th>
          </tr>
        </thead>
        <tbody>
          {filtered?.map((deal, index) => {
            const { img, text, style } = utils.paymentMethod(deal.payment);
            return (
              <tr
                key={`deals-${index + 1}`}
                onMouseEnter={() => setDidHoverID(index)}
                onMouseLeave={() => setDidHoverID(-1)}
              >
                <td>
                  <h6>
                    {getGenderIcon(deal?.customerId?.isMale)}{" "}
                    {fullName(deal?.customerId?.fullName)}
                  </h6>
                  <MDBBadge color="info" className="mr-2">
                    {capitalize(
                      deal?.category === "walkin"
                        ? deal?.category
                        : Categories.find(({ abbr }) => abbr === deal?.category)
                            .name
                    )}
                  </MDBBadge>
                  @ {new Date(deal?.createdAt).toLocaleTimeString()}
                </td>
                <td>
                  <h6>
                    {deal.physicianId?.fullName.lname &&
                      `Dr. ${deal.physicianId.fullName.lname}`}
                  </h6>

                  <p>{deal.source?.companyName}</p>
                </td>
                <td className="cursor-pointer" onClick={() => handleView(deal)}>
                  <div className="d-flex align-items-center">
                    <h6
                      className="mt-2"
                      style={{ fontWeight: 600 }}
                      title="Amount"
                    >
                      {currency(deal.amount)}
                    </h6>
                    <img
                      src={img}
                      alt={text}
                      className="ml-1"
                      title={text}
                      style={{
                        ...style,
                      }}
                    />
                  </div>
                  <h6 title="Cash"> {currency(deal.cash)}</h6>
                  {/* {deal.payment}: */}
                  {/* <MDBCard className="ml-1" title="bank transfer"> */}

                  {/* </MDBCard> */}
                  {/* <MDBIcon
                      icon="receipt"
                      className="ml-1"
                      title="Print Reciept"
                      onClick={() => handleView(deal)}
                    /> */}
                </td>

                <td>
                  {/* {didHoverID === index ? (
                    <MDBBtn size="sm" color="info">
                      <MDBIcon icon="print" />
                    </MDBBtn>
                  ) : ( */}
                  <>
                    {/* {deal.cart?.map((menu) => (
                      <MDBBadge key={menu.referenceId} className="mx-1">
                        {menu?.abbreviation}
                      </MDBBadge>
                    ))} */}

                    {didHoverID === index && (
                      <div className="d-flex justify-content-center">
                        <MDBBtnGroup>
                          <MDBBtn
                            size="sm"
                            color="success"
                            title="Add new service"
                            rounded
                            onClick={() => handleCashRegister(deal)}
                          >
                            <MDBIcon icon="plus" />
                          </MDBBtn>
                          <MDBBtn
                            size="sm"
                            color="info"
                            rounded
                            title="Print receipt."
                            onClick={() => handleView(deal)}
                          >
                            <MDBIcon icon="print" />
                          </MDBBtn>
                        </MDBBtnGroup>
                      </div>
                    )}
                    {deal.cart?.map((menu) => (
                      <MDBBadge
                        key={menu.referenceId}
                        className="mx-1 "
                        style={{ opacity: index === didHoverID ? 0 : 1 }}
                      >
                        {menu?.abbreviation}
                      </MDBBadge>
                    ))}
                  </>
                  {/* )} */}

                  {/* <MDBIcon
                    icon="plus"
                    className="mr-2 cursor-pointer"
                    style={{ color: "blue" }}
                    title="Add"
                    onClick={() => handleCashRegister(deal)}
                  /> */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
    </>
  );
};

export default Tables;

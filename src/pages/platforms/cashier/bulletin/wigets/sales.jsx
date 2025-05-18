import React, { useState, useEffect } from "react";
import { MDBCard, MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import { currency } from "../../../../../services/utilities";

const Sales = () => {
  const [dailySales, setDailySales] = useState(0);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const query = {
      date: today,
      branchId: localStorage.getItem("branchId"),
    };
    fetch("/api/deals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((res) => res.json())
      .then((data) => {
        setDailySales(data.reduce((total, deal) => total + deal.total, 0));
      });
  }, []);

  return (
    <MDBCol xl="3" md="6" className="mb-4 mb-r">
      <MDBCard>
        <MDBRow className="mt-3">
          <MDBCol md="5" size="5" className="text-left pl-4">
            <MDBBtn
              tag="a"
              floating
              size="lg"
              color="primary"
              className="ml-4"
              style={{ padding: 0 }}
            >
              <MDBIcon icon="eye" size="2x" />
            </MDBBtn>
          </MDBCol>
          <MDBCol md="7" col="7" className="text-right pr-5">
            <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
              {currency(dailySales)}
            </h5>
            <p className="font-small grey-text">Sales</p>
          </MDBCol>
        </MDBRow>
        <MDBRow className="my-3">
          <MDBCol md="7" col="7" className="text-left pl-4">
            <p className="font-small dark-grey-text font-up ml-4 font-weight-bold">
              Transactions
            </p>
          </MDBCol>
          <MDBCol md="5" col="5" className="text-right pr-5">
            <p className="font-small grey-text">{dailySales}</p>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBCol>
  );
};

export default Sales;

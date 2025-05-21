import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBRow, MDBCol, MDBBtn, MDBIcon } from "mdbreact";
import { currency, axioKit } from "../../../../../services/utilities";

const Insources = () => {
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [lastMonthSales, setLastMonthSales] = useState(0);

  const { activePlatform, auth, token } = useSelector(({ auth }) => auth);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const queryCurrentMonth = {
      cashier: auth._id,
      branch: activePlatform.branchId,
      month: month + 1,
      year,
    };

    axioKit
      .universal(
        `finance/bookkeeping/remittances/widgets`,
        token,
        queryCurrentMonth
      )
      .then((res) => {
        setCurrentMonthSales(res.current.totalSales || 0);
        setLastMonthSales(res.last.totalSales || 0);
        localStorage.setItem(
          "currentVouchers",
          JSON.stringify(res.current.totalVouchers || 0)
        );
        localStorage.setItem(
          "lastMonthVouchers",
          JSON.stringify(res.last.totalVouchers)
        );
        console.log(res);
      })
      .catch((err) => console.log(err.message));
  }, [activePlatform, auth, token]);

  return (
    <MDBCol xl="3" md="6" className="mb-4 mb-r">
      <MDBCard>
        <MDBRow className="mt-3">
          <MDBCol md="5" col="5" className="text-left pl-4">
            <MDBBtn
              tag="a"
              floating
              size="lg"
              color="info"
              className="ml-4"
              style={{ padding: 0 }}
            >
              <MDBIcon icon="eye" size="2x" />
            </MDBBtn>
          </MDBCol>
          <MDBCol md="7" col="7" className="text-right pr-5">
            <h5 className="ml-4 mt-4 mb-2 font-weight-bold">
              {currency(currentMonthSales)}
            </h5>
            <p className="font-small grey-text">Current Vouchers</p>
          </MDBCol>
        </MDBRow>

        <MDBRow className="my-3">
          <MDBCol md="7" col="7" className="text-left pl-4">
            <p className="font-small dark-grey-text font-up ml-4 font-weight-bold">
              Last Month
            </p>
          </MDBCol>
          <MDBCol md="5" col="5" className="text-right pr-5">
            <p className="font-small grey-text"> {currency(lastMonthSales)}</p>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBCol>
  );
};

export default Insources;

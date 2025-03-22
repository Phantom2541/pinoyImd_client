import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CashRegister from "../cashierOld/pos";
import { MDBCard, MDBCardBody, MDBContainer } from "mdbreact";
import Header from "./list/header";
import Body from "./list/body";
import Footer from "./list/footer";
import TableLoading from "../../../../../../components/tableLoading";
import { Closing, Payments, Vouchers } from "./summary";
import { Daily } from "../../../../../../services/redux/slices/finance/journals/payments";

export default function Deals() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ deals }) => deals),
    { filtered } = useSelector(({ payments }) => payments),
    dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const date = new Date().toISOString().split("T")[0];
      dispatch(
        Daily({
          token,
          key: {
            branchId: activePlatform.branchId,
            payor: auth._id,
            date,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform.branchId, auth._id]);

  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <MDBCard narrow style={{ minHeight: "75vh" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
        <CashRegister />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Payments />
        {filtered.length > 0 && <Vouchers />}
        <Closing />
      </div>
    </MDBContainer>
  );
}

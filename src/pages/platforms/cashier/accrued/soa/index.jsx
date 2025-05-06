import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";

import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";

import { SOA } from "../../../../../../src/services/redux/slices/finance/journals/payables";
const Statements = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading, month, year } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    if (token)
      dispatch(
        SOA({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            fsId: 31, // Outsourcing Expense"
            year,
            month,
          },
        })
      );
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Statements;

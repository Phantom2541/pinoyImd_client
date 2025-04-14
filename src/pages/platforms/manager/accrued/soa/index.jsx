import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBAnimation } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/billing";
import { SOA } from "../../../../../../src/services/redux/slices/finance/journals/payables";
const Statements = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading, month, year } = useSelector(({ deals }) => deals),
    { isSuccess, message } = useSelector(({ billing }) => billing),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    if (token)
      dispatch(
        SOA({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            fsId: 31,
            year,
            month,
          },
        })
      );
  }, [token, dispatch, activePlatform, month, year]);

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);
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

import React, { useEffect } from "react";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import { useToasts } from "react-toast-notifications";

import Header from "./header";
import Body from "./collapse";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";
import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";

const Vouchers = () => {
  const { isLoading, isSuccess, message } = useSelector(({ deals }) => deals),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBAnimation type="bounceInDown">
      <MDBCard narrow style={{ minHeight: "600px" }}>
        <Header />
        <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
        <Footer />
      </MDBCard>
    </MDBAnimation>
  );
};

export default Vouchers;

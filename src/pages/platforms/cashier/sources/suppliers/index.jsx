import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import { BROWSE } from "../../../../../services/redux/slices/assets/branches";
import { BROWSE as BROWSE_COMPANIES } from "../../../../../services/redux/slices/assets/companies";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";

const Index = () => {
  const { token } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();
  useEffect(() => {
    if (token) dispatch(BROWSE({ token }));
  }, [token, dispatch]);

  useEffect(() => {
    if (token) dispatch(BROWSE_COMPANIES({ token }));
  }, [token, dispatch]);

  return (
    <>
      <MDBAnimation type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <Modal />
    </>
  );
};

export default Index;

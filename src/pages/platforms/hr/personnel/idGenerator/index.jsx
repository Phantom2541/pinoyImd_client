import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CTBROWSE as CARD } from "../../../../../services/redux/slices/assets/branches";
import {
  IDGENERATOR,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import TableLoading from "../../../../../components/tableLoading";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import Modal from "./modal";
import Print from "./print";

export default function IDGenerator() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { isLoading } = useSelector(({ personnels }) => personnels);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(CARD({ token, data: { _id: activePlatform.branchId } }));
      dispatch(IDGENERATOR({ token, branchId: activePlatform.branchId }));
    }
    return () => dispatch(RESET());
  }, [dispatch, token, activePlatform]);

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
}

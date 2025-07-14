import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBAnimation, MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import PayablesModal from "./modal/payables";
import PaymentsModal from "./modal/payments";
import Footer from "./footer";

import {
  BROWSE as PROVIDERS,
  RESET as PROVIDERRESET,
} from "../../../../../services/redux/slices/assets/providers";

export default function Payables() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  // support providers
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        PROVIDERS({
          token,
          key: {
            clients: activePlatform?.branchId,
            category: ["expenses"], // utilities", "suppliers
          },
        })
      );
    }
    return () => {
      dispatch(PROVIDERRESET());
    };
  }, [token, activePlatform, dispatch]);

  return (
    <>
      <MDBAnimation className="pt-2" type="bounceInDown">
        <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
          <Header />
          <MDBCardBody>
            <Body />
          </MDBCardBody>
          <Footer />
        </MDBCard>
      </MDBAnimation>
      <PayablesModal />
      <PaymentsModal />
    </>
  );
}

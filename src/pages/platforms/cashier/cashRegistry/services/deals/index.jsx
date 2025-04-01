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
import {
  INSOURCE,
  RESET,
  SetSOURCE,
} from "../../../../../../services/redux/slices/assets/providers.js";

export default function Deals() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ deals }) => deals),
    { filtered } = useSelector(({ payments }) => payments),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform.branchId) {
      /**
       * get local time of users
       * Format: YYYY-MM-DD
       */
      const date = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

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
      /**
       * Fetch source provider from the server and store it in localStorage
       * this data is not slow moving info
       */
      const branchId = activePlatform.branchId;
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        const sourceData = JSON.parse(storedSource);

        dispatch(SetSOURCE(sourceData));
      } else {
        dispatch(INSOURCE({ token, key: { vendors: activePlatform.branchId } }))
          .then(({ payload }) => {
            const sourceData = payload.payload;
            console.log("sourceData", sourceData);

            localStorage.setItem(
              `source_${branchId}`,
              JSON.stringify(sourceData)
            );
          })
          .catch((error) => {
            console.error("Error fetching source data:", error);
          });
      }

      return () => {
        dispatch(RESET());
      };
    }
  }, [token, dispatch, activePlatform.branchId, auth._id]);

  return (
    <MDBContainer className="d-flex" fluid>
      <div className=" py-1 rounded flex-1 ml-2 px-2">
        <MDBCard narrow>
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

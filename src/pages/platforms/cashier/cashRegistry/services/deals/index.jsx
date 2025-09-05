import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CashRegister from "../cashierOld/pos";
import { MDBCard, MDBCardBody } from "mdbreact";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";
import TableLoading from "../../../../../../components/tableLoading";
import { Closing, Category, Payments } from "./summary";
import { Daily } from "../../../../../../services/redux/slices/finance/journals/payments";
import {
  INSOURCE as BROWSE_INSOURCES,
  RESET,
  SetSOURCE as SET_INSOURCES,
} from "../../../../../../services/redux/slices/assets/providers.js";
import {
  IDB_BROWSE,
  IDB_BULK_SAVE,
} from "../../../../../../services/indexDB/assets/insources.js";
import { Denomination } from "../remittances/modal/index.js";
import { Tracker } from "../../../../../../services/utilities/index.js";

export default function Deals() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { dealsLoading: isLoading } = useSelector(({ deals }) => deals),
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

      return () => {
        dispatch(RESET());
      };
    }
  }, [token, dispatch, activePlatform.branchId, auth._id]);

  useEffect(() => {
    const init = async () => {
      await Tracker.initialize({
        config: {
          token,
          branchId: activePlatform.branchId,
          trackerKey: "insource",
          params: {
            vendors: activePlatform.branchId,
            status: "approved",
          },
        },
        idb: { BROWSE: IDB_BROWSE, SAVE: IDB_BULK_SAVE },
        redux: {
          BROWSE: BROWSE_INSOURCES,
          SetCOLLECTIONS: SET_INSOURCES,
        },
      });
    };

    init();
  }, [token, activePlatform]);

  return (
    <div className="d-flex" fluid>
      <div className="rounded flex-1 ml-2 px-2">
        <MDBCard narrow>
          <Header />
          <MDBCardBody>{isLoading ? <TableLoading /> : <Body />}</MDBCardBody>
          <Footer />
        </MDBCard>
        <CashRegister />
      </div>
      <div style={{ width: "300px", marginLeft: "10px" }}>
        <Category />
        {filtered.length > 0 && <Payments />}
        <Closing />
      </div>
      <Denomination />
    </div>
  );
}

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
  INSOURCE as BROWSE_SOURCES,
  RESET,
  SETSOURCES,
} from "../../../../../../services/redux/slices/assets/providers.js";

import {
  IDB_BULK_SAVE as IDB_SAVE_SOURCES,
  IDB_BROWSE as IDB_BROWSE_SOURCES,
} from "../../../../../../services/indexDB/assets/insources";
import { Denomination } from "../remittances/modal/index.js";
import {
  SetPHYSICIANS,
  BROWSE as BROWSE_PHYSICIANS,
} from "../../../../../../services/redux/slices/assets/persons/physicians.js";
import {
  IDB_BULK_SAVE as IDB_PHYSICIANS_SAVE,
  IDB_BROWSE as IDB_BROWSE_PHYSICIANS,
} from "../../../../../../services/indexDB/assets/persons/globalPhysicians";

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
    }
  }, [token, dispatch, activePlatform.branchId, auth._id]);

  const trackers = [
    {
      key: "insource",
      idb: { BROWSE: IDB_BROWSE_SOURCES, SAVE: IDB_SAVE_SOURCES },
      redux: { BROWSE: BROWSE_SOURCES, SetCOLLECTIONS: SETSOURCES },
      params: { vendors: activePlatform.branchId, status: "approved" },
    },
    {
      key: "physician",
      idb: { BROWSE: IDB_BROWSE_PHYSICIANS, SAVE: IDB_PHYSICIANS_SAVE },
      redux: { BROWSE: BROWSE_PHYSICIANS, SetCOLLECTIONS: SetPHYSICIANS },
    },
  ];

  useEffect(() => {
    const initAll = async () => {
      for (const t of trackers) {
        await Tracker.initialize({
          config: {
            token,
            branchId: activePlatform.branchId,
            trackerKey: t.key,
            ...(t.params && { params: t.params }),
          },
          idb: t.idb,
          redux: t.redux,
        });
      }
    };
    initAll();
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

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESET } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { MDBCard } from "mdbreact";
import DealCollapse from "./collapse";
import Header from "./header";
import Footer from "./footer";
import TableLoading from "../../../../../components/tableLoading";
/**
 * For refrences to the following deals
 */
import {
  HEADS as BROWSE_HEADS,
  SetHEADS,
  SetByGroup,
  SetByStatus,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  BROWSE as BROWSE_PREFERENCES,
  SetPREFERENCES,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
import {
  IDB_BROWSE as IDB_BROWSE_PREFERENCES,
  IDB_BULK_SAVE as IDB_SAVE_PEREFERENCES,
} from "../../../../../services/indexDB/diagnostics/laboratory/preferences";
import {
  IDB_BROWSE as IDB_BROWSE_HEADS,
  IDB_BULK_SAVE as IDB_SAVE_HEADS,
} from "../../../../../services/indexDB/assets/persons/heads";
import {
  IDB_BROWSE as IDB_BROWSE_PHYSICIANS,
  IDB_BULK_SAVE as IDB_SAVE_PHYSICIANS,
} from "../../../../../services/indexDB/assets/persons/physicians";
import {
  BROWSE as BROWSE_PHYSICIANS,
  SetPHYSICIANS,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import ResultEntry from "./modal";
import Table from "./table";
import { Tracker } from "../../../../../services/utilities";

export default function Tasks() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { message, isSuccess } = useSelector(({ deals }) => deals),
    { isLoading, byGroup, isLoadingHeads } = useSelector(
      ({ validator }) => validator
    ),
    { isLoading: physicianLoading } = useSelector(
      ({ physicians }) => physicians
    ),
    { isLoading: preferencesLoading } = useSelector(
      ({ preferences }) => preferences
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    const trackers = [
      {
        trackerKey: "preference",
        idb: { BROWSE: IDB_BROWSE_PREFERENCES, SAVE: IDB_SAVE_PEREFERENCES },
        redux: { BROWSE: BROWSE_PREFERENCES, SetCOLLECTIONS: SetPREFERENCES },
      },
      {
        trackerKey: "head",
        idb: { BROWSE: IDB_BROWSE_HEADS, SAVE: IDB_SAVE_HEADS },
        redux: { BROWSE: BROWSE_HEADS, SetCOLLECTIONS: SetHEADS },
      },
      {
        trackerKey: "physician",
        idb: { BROWSE: IDB_BROWSE_PHYSICIANS, SAVE: IDB_SAVE_PHYSICIANS },
        redux: { BROWSE: BROWSE_PHYSICIANS, SetCOLLECTIONS: SetPHYSICIANS },
      },
    ];

    const init = async () => {
      for (const t of trackers) {
        await Tracker.initialize({
          config: {
            token,
            branchId: activePlatform.branchId,
            trackerKey: t.trackerKey,
          },
          idb: t.idb,
          redux: t.redux,
        });
      }
    };

    init();
  }, [token, activePlatform]);
  useEffect(() => {
    dispatch(SetByGroup("all"));
    dispatch(SetByStatus("all"));
  }, [dispatch]);

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);
  return (
    <MDBCard narrow>
      <Header />
      {isLoading || physicianLoading || preferencesLoading || isLoadingHeads ? (
        <TableLoading />
      ) : byGroup === "all" ? (
        <DealCollapse />
      ) : (
        <Table />
      )}
      <Footer />
      <ResultEntry />
    </MDBCard>
  );
}

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { Search } from "./../../../../../../components/searchables";
import {
  CASHIER,
  SetFILTERED,
  SetCOLLECTIONS,
  RESET,
} from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import { IDB_BROWSE } from "../../../../../../services/indexDB/commerce/pos/services/deals";
import { fetchTracker } from "../../../../../../services/utilities";
const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ deals }) => deals
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial CASHIER
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      IDB_BROWSE().then((deals) => {
        if (fetchTracker.hasLoaded("deals")) {
          dispatch(SetCOLLECTIONS(deals));
        } else {
          let date;
          if (deals.length > 0) {
            date = fetchTracker.get.formattedDate(
              fetchTracker.get.lastFetchCreatedAt(deals),
              true
            );
          } else {
            date = fetchTracker.get.formattedDate();
          }
          dispatch(
            CASHIER({
              token,
              key: {
                branchId: activePlatform?.branchId,
                cashierId: auth._id,
                date,
                timezone: fetchTracker.get.timeZone(),
              },
            })
          );
        }
      });
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <i>Transactions List</i>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            setFiltered={(results) => dispatch(SetFILTERED(results))}
            reset={() => dispatch(SetFILTERED(collections))}
            collections={collections}
            isLoading={isLoading}
            haveAction={false}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

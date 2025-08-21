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
import { INSOURCE } from "./../../../../../../services/redux/slices/assets/providers";
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
    const formattedDate = (timeZone, date, hasTime = false) => {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...(hasTime && {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      })
        .format(date)
        .replace(/\//g, "-");
    };
    if (token && activePlatform?.branchId && auth._id) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      IDB_BROWSE().then((deals) => {
        if (fetchTracker.hasLoaded("deals")) {
          dispatch(SetCOLLECTIONS(deals));
        } else {
          let date;
          if (deals.length > 0) {
            const latest = deals.reduce((prev, curr) =>
              new Date(curr.createdAt) > new Date(prev.createdAt) ? curr : prev
            );
            date = formattedDate(timezone, new Date(latest.createdAt), true);
          } else {
            date = formattedDate(timezone, new Date());
          }
          dispatch(
            CASHIER({
              token,
              key: {
                branchId: activePlatform?.branchId,
                cashierId: auth._id,
                date,
                timezone,
              },
            })
          );
        }
      });
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    dispatch(
      INSOURCE({
        token,
        key: { vendors: activePlatform?.branchId, status: "approved" },
      })
    );
  }, [dispatch, activePlatform, token]);

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

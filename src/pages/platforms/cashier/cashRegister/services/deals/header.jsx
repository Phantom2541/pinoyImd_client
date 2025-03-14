import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import { currency, globalSearch } from "../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { FilterCollections } from "../../../../../../components/searchables";
import {
  CASHIER,
  SetFILTERED,
  // setVIEW,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, filtered, total, message, isSuccess } = useSelector(
      ({ deals }) => deals
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial CASHIER
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const today = new Date().setHours(0, 0, 0, 0); //date and time today starting from 00:00 AM

      dispatch(
        CASHIER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            cashierId: auth._id,
            date: today,
          },
        })
      );
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

  const handleFilletered = (key) => {
    if (!key) return dispatch(SetFILTERED(collections));
    const _filtered = globalSearch(collections, key);
    dispatch(SetFILTERED(_filtered));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          <h5>{`${currency(total)} @ ${filtered?.length} Patient/s`}</h5>
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <FilterCollections setFiltered={(key) => handleFilletered(key)} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

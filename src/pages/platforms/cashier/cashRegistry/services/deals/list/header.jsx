import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import { globalSearch } from "../../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { FilterCollections } from "../../../../../../../components/searchables";
import {
  CASHIER,
  SetFILTERED,
  // setVIEW,
  RESET,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
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
      const date = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      dispatch(
        CASHIER({
          token,
          key: {
            branchId: activePlatform?.branchId,
            cashierId: auth._id,
            date,
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
        <i>Patient List</i>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <FilterCollections
            setFiltered={(key) => handleFilletered(key)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

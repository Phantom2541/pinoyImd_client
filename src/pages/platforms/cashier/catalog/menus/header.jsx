import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../components/searchables";
import { MDBView } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  SetFILTERED,
  RESET,
} from "../../../../../services/redux/slices/commerce/catalog/menus";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, message, isSuccess, collections } = useSelector(
      ({ menus }) => menus
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

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
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Menus
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            reset={() => dispatch(SetFILTERED(collections))}
            haveAction={false}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

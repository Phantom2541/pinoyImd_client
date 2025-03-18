import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import {
  currency,
  fullName,
  globalSearch,
} from "./../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { FilterCollections } from "./../../../../../../components/searchables";
import {
  BROWSE,
  SetFILTERED,
  SetFilterByCASHIER,
  RESET,
} from "./../../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { collections, message, isSuccess } = useSelector(({ deals }) => deals);
  const [cashiers, setCashiers] = useState([]);
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  // Initial Fetch for Collections
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const today = new Date().setHours(0, 0, 0, 0);
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            createdAt: today,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const handleFiltered = (key) => {
    if (!key) return dispatch(SetFILTERED(collections));
    const _filtered = globalSearch(collections, key);
    dispatch(SetFILTERED(_filtered));
  };

  useEffect(() => {
    if (!collections || collections.length === 0) return;

    // Remove duplicate cashier IDs and filter out deleted records
    const uniqueUsers = [
      ...new Map(
        collections
          .filter((item) => !item.deleted && item.cashierId) // Ensure deleted items are excluded
          .map(({ cashierId }) => [cashierId._id, cashierId])
      ).values(),
    ];

    setCashiers(uniqueUsers);
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <select
          className="form-control mr-3 bg-light"
          onChange={(e) => dispatch(SetFilterByCASHIER(e.target.value))} // setSelectedCashier(e.target.value)}
        >
          <option value="">Select Cashier</option>
          {cashiers.map((cashier) => (
            <option key={cashier._id} value={cashier._id}>
              {fullName(cashier?.fullName)}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex align-items-center">
        {/* Cashier Selection Dropdown */}

        {/* Filter Input */}
        <FilterCollections setFiltered={(key) => handleFiltered(key)} />
      </div>
    </MDBView>
  );
};

export default Header;

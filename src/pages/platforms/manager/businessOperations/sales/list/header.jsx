import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon, MDBView } from "mdbreact";
import { fullName } from "./../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { Search } from "./../../../../../../components/searchables";
import {
  BROWSE,
  SetFILTERED,
  SetFilterByCASHIER,
  RESET,
} from "./../../../../../../services/redux/slices/commerce/pos/services/deals";
import { INSOURCE } from "../../../../../../services/redux/slices/assets/providers";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { collections, message, isSuccess } = useSelector(({ deals }) => deals);
  const [cashiers, setCashiers] = useState([]);
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  // Initial Fetch for Collections
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      const createdAt = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            createdAt,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    dispatch(INSOURCE({ token, key: { vendors: activePlatform?.branchId } }));
  }, [dispatch, activePlatform, token]);

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }
    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    dispatch(SetFILTERED(collections));
  }, [dispatch, collections]);

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
          <option value="" disabled>
            Select Cashier
          </option>
          <option value={"all"}>All</option>
          {cashiers.map((cashier) => (
            <option key={cashier._id} value={cashier._id}>
              {fullName(cashier?.fullName)}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex align-items-center">
        <MDBIcon
          title="Download Daily Sales (darrel assignment)"
          onClick={() => alert("darrel assignment, pa alala nyo Pls.")}
          icon="file-excel"
          size="lg"
          className="mr-2"
        />
      </div>
      <div className="d-flex align-items-center">
        <Search
          setFiltered={(results) => dispatch(SetFILTERED(results))}
          reset={() => dispatch(SetFILTERED(collections))}
          collections={collections}
          haveAction={false}
        />
      </div>
    </MDBView>
  );
};

export default Header;

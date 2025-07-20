import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  FilterByVendor,
  RESET,
  SOA_RECORDS,
} from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, filtered, month, year, supplier } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    { collections: payables } = useSelector(({ payables }) => payables),
    [suppliers, setSuppliers] = useState([]),
    dispatch = useDispatch();
  //Filtering Supplier ID
  useEffect(() => {
    let uniqueSource = [];
    if (collections.length > 0)
      uniqueSource = [
        ...new Map(
          collections.map(({ vendor }) => {
            const { _id = "", displayname = "", name = "" } = vendor || {};
            const soa = payables.find(
              ({ supplier }) => String(supplier?.vendors) === String(_id)
            );

            return [
              vendor?._id || "undefined",
              {
                _id,
                soa,
                displayname: soa
                  ? `${name || displayname} (₱${soa.amount.toLocaleString()})`
                  : displayname,
              },
            ];
          })
        ).values(),
      ];
    setSuppliers(uniqueSource);
  }, [collections, payables]);
  //initial values
  useEffect(() => {
    if (token) {
      dispatch(
        SOA_RECORDS({
          token,
          key: {
            branchId: activePlatform?.branchId,
            month,
            year,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);
  const handleVendors = (value) => {
    const vendor = suppliers.find(({ _id }) => _id === value);
    dispatch(FilterByVendor({ value, vendor }));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="white-text mx-3 text-nowrap mt-0">
        {filtered?.length} Sendout/s
      </span>
      <div style={{ width: "20rem" }}>
        <div className="d-flex align-items-center">
          <span className="mr-2">Supplier:</span>
          <select
            className="form-control bg-light"
            value={supplier}
            onChange={({ target }) => handleVendors(target.value)}
          >
            <option value="all">All</option>
            {suppliers.map(({ _id, displayname }) => (
              <option key={_id} value={_id}>
                {displayname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

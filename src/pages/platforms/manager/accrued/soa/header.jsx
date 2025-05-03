import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import {
  BROWSE,
  RESET,
  SetFilterByOUTSOURCE,
} from "../../../../../services/redux/slices/commerce/pos/services/billing";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, filtered, month, year } = useSelector(
      ({ billings }) => billings
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
          collections.map(({ outsource: vendor }) => {
            const { _id = "", displayname = "" } = vendor || {};
            const soa = payables.find(
              ({ supplier }) => String(supplier.vendors) === String(_id)
            );

            return [
              vendor?._id || "undefined",
              {
                _id,
                soa,
                displayname: soa
                  ? `${displayname} (₱${soa.amount.toLocaleString()})`
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
        BROWSE({
          token,
          keys: {
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
    dispatch(SetFilterByOUTSOURCE({ value, vendor }));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Sendout/s
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Select
            className="m-0 p-0  mr-4 "
            placeholder="Supplier"
            values={"displayname"}
            keys="_id"
            onChange={(value) => handleVendors(value)}
            inputClassName="m-0 p-0 text-white"
            collections={suppliers?.map(({ _id, displayname }) => ({
              _id,
              displayname,
            }))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

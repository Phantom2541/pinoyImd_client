import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import {
  OUTSOURCES,
  SetFilterByOUTSOURCE,
  SetMONTH,
  RESET,
} from "../../../../../services/redux/slices/commerce/pos/services/deals";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, month, year } = useSelector(({ deals }) => deals),
    { collections: payables } = useSelector(({ payables }) => payables),
    [suppliers, setSuppliers] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token) {
      dispatch(
        OUTSOURCES({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            // cashierId: auth._id,
            month,
            year,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year, auth]);

  //Filtering Supplier ID
  useEffect(() => {
    let uniqueSource = [];
    if (collections.length > 0)
      uniqueSource = [
        ...new Map(
          collections.map(({ outsource: vendor }) => {
            const { _id = "", displayname } = vendor || {};
            const soa = payables.find(
              ({ supplier }) => String(supplier?.vendors) === String(_id)
            );

            return [
              vendor?._id || "undefined",
              {
                _id,
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

  const handleVendors = (value) => {
    dispatch(SetFilterByOUTSOURCE(value));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          <CalendarPicker
            month={month}
            year={year}
            moved={(direction) => dispatch(SetMONTH(direction))}
            reset={() => dispatch(RESET())}
          />
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
            collections={suppliers?.map(({ _id = "", displayname = "" }) => ({
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

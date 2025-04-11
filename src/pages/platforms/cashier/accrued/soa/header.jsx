import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { OUTSOURCES } from "../../../../../services/redux/slices/commerce/pos/services/deals";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, month, year } = useSelector(({ deals }) => deals),
    { collections } = useSelector(({ payables }) => payables),
    // [cluster, setCluster] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token) {
      dispatch(
        OUTSOURCES({
          token,
          keys: {
            branchId: activePlatform?.branchId,
            month,
            year,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Services
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Select
            className="m-0 p-0  mr-4 "
            values={"supplier.displayname"}
            placeholder="Supplier"
            keys="_id"
            // onChange={(value) => handleComponent(value || "LAB")}
            inputClassName="m-0 p-0 text-white"
            collections={collections?.map(({ _id, supplier, amount }) => ({
              _id,
              supplier,
              amount,
            }))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

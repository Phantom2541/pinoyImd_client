import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  FILTERBYCATEGORY,
  ResetFILTER,
  SetCREATE,
  SetFILTER,
} from "../../../../../services/redux/slices/assets/providers";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, collections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();
  //initial values
  useEffect(() => {
    if (token) {
      dispatch(
        FILTERBYCATEGORY({
          token,
          keys: { clients: activePlatform?.branchId, category: "utilities" },
        })
      );
    }
  }, [token, activePlatform, dispatch]);
  const handleAdd = (key) => dispatch(SetCREATE({ displayname: key }));
  const handleFiltered = (items) => dispatch(SetFILTER(items));

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      {/* Left - Count */}
      <div>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Utilities
        </span>
      </div>

      {/* Center - Title */}
      <div className="flex-grow-1 text-center">
        <span className="white-text font-weight-bold">
          Utilities & Service Providers
        </span>
      </div>

      {/* Right - Search */}
      <div className="text-right d-flex items-center">
        <Search
          collections={collections}
          setFiltered={handleFiltered}
          handleAdd={handleAdd}
          reset={() => dispatch(ResetFILTER())}
        />
      </div>
    </MDBView>
  );
};

export default Header;

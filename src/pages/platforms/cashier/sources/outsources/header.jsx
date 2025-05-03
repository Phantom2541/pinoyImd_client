import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  OUTSOURCE,
  SetCREATE,
  SetFILTER,
  ResetFILTER,
} from "../../../../../services/redux/slices/assets/providers";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        OUTSOURCE({
          token,
          key: {
            clients: activePlatform?.branchId,
            category: "outsource",
          },
        })
      );
    }
  }, [token, activePlatform, dispatch]);

  const handleAdd = (key) => dispatch(SetCREATE({ displayname: key }));
  const handleFiltered = (items) => dispatch(SetFILTER(items));

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Outsources
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collection={filtered}
            handleFiltered={handleFiltered}
            handleAdd={handleAdd}
            reset={() => dispatch(ResetFILTER())}
            willcreate={true}
            hideButton={false}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

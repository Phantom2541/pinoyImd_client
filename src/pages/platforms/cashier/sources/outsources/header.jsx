import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import Search from "../../../../../components/searchables/search";
import {
  OUTSOURCE,
  SetCREATE,
  SetFILTER,
} from "../../../../../services/redux/slices/assets/providers";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, filtered } = useSelector(({ providers }) => providers);
  const dispatch = useDispatch();

  // Load outsources initially
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        OUTSOURCE({
          token,
          key: {
            clients: activePlatform?.branchId,
          },
        }),
      );
    }
  }, [token, activePlatform, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered?.length} Outsources (Sendout)
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search by name"
            reset={() => dispatch(SetFILTER(collections))}
            hideButton={true}
            handleAdd={(item) => dispatch(SetCREATE(item))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

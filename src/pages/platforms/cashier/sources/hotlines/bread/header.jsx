import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../../components/searchables";
import {
  FILTERBYCATEGORY,
  SetHOTLINESFILTER,
  ResetHOTLINES,
  SetCREATE,
} from "../../../../../../services/redux/slices/assets/providers";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { hotlines, hotlineCollections } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  // Fetch hotlines on component mount and update filtered services based on the category
  useEffect(() => {
    if (token) {
      dispatch(
        FILTERBYCATEGORY({
          token,
          keys: { clients: activePlatform?.branchId, category: "hotline" },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  // Handle Add function - make sure service is not empty before dispatching
  const handleAdd = (key) => dispatch(SetCREATE({ displayname: key }));
  const handleFiltered = (items) => dispatch(SetHOTLINESFILTER(items));
  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {hotlines.length} hotlines
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={hotlineCollections}
            setFiltered={handleFiltered}
            reset={() => dispatch(ResetHOTLINES())}
            handleAdd={handleAdd}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

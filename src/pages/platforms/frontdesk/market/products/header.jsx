import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterProducts } from "../../../../../components/searchables";
import { MDBView } from "mdbreact";
import {
  SetFILTER,
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/market/products";
const Header = () => {
  // Hooks should be used at the top level inside the function
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ products }) => products),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  console.log(collections);
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Products</span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <FilterProducts setFiltered={key => dispatch(SetFILTER(key))} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

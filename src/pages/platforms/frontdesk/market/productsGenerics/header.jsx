import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  BROWSE,
  SetFILTER,
} from "../../../../../services/redux/slices/market/productsGenerics";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    dispatch = useDispatch();
  // console.log("collections", collections);

  //initial values
  useEffect(() => {
    if (token)
      dispatch(
        BROWSE({ token, params: { branchId: activePlatform?.branchId } })
      );
  }, [dispatch, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} generics
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={collections}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search generics"
            // haveAction={false}
            reset={() => dispatch(SetFILTER(collections))}
            hideButton={false}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

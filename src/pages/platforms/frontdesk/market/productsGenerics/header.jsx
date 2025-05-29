import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { Templates, Services } from "../../../../../services/fakeDb";
import { BROWSE } from "../../../../../services/redux/slices/market/productsGenerics";

const Header = () => {
  const { maxPage, tokens, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered } = useSelector(({ productsGenerics }) => productsGenerics);
  const [component, setComponent] = useState("");
  const [generics, setGenerics] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (maxPage)
      dispatch(
        BROWSE({ tokens, params: { branchId: activePlatform?.branchId } })
      );
  }, [dispatch, maxPage]);

  useEffect(() => {
    if (filtered) setGenerics(filtered);
  }, [filtered]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {generics.length} generics
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          {/* <Select
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            collections={Templates.getComponents("LAB")}
          /> */}
          <MDBBtn>
            <MDBIcon icon="plus" />
          </MDBBtn>
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { Templates, Services } from "../../../../../services/fakeDb";

const Header = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    console.log(maxPage);
  }, [dispatch, maxPage]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {maxPage} Pages
        </span>
      </div>
      <div>
        <div>
          <Select
            className="m-1 mt-2 mr-4"
            inputClassName="m-0"
            collections={Templates.getComponents("LAB")}
            label="Select Component"
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import CustomSelect from "../../../components/searchables/customSelect";
import { Templates, Services } from "../../../services/fakeDb";
import {
  SetSERVICES,
  SetByTEMPLATES,
} from "../../../services/redux/slices/commerce/catalog/services";

const Header = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    [component, setComponent] = useState(""),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    dispatch(SetSERVICES({ collections: Services.collections, maxPage }));
  }, [dispatch, maxPage]);

  const handleComponent = (value) => {
    setComponent(value);

    const template = Templates.getComponentIndex(value);

    dispatch(SetByTEMPLATES(template));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Services</span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <CustomSelect
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            choices={Templates.getComponents("LAB")}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

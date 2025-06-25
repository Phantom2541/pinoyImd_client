import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../components/customizable";
import { Templates, Services } from "../../../services/fakeDb";
import {
  SetCOLLECTIONS,
  SetByTEMPLATES,
} from "../../../services/redux/slices/commerce/catalog/services";
const Header = () => {
  const { maxPage } = useSelector(({ auth }) => auth);
  const { filtered } = useSelector(({ services }) => services);
  const [component, setComponent] = useState("");
  const [services, setServices] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (maxPage)
      dispatch(SetCOLLECTIONS({ collections: Services.collections, maxPage }));
  }, [dispatch, maxPage]);

  useEffect(() => {
    if (filtered) setServices(filtered);
  }, [filtered]);

  const handleComponent = (value) => {
    setComponent(value);

    const template = Templates.getComponentIndex(value);
    dispatch(SetByTEMPLATES(template));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {services.length} Services console.log(services);
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Select
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            collections={Templates.getComponents("LAB")}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

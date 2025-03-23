import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { CustomSelect } from "../../../../../components/searchables";
import { SearchTemplates as Templates } from "../../../../../components/searchables";
import { Services } from "../../../../../services/fakeDb";
import {
  SetSERVICES,
  SetFILTERED,
  SetCLUSTER,
} from "../../../../../services/redux/slices/commerce/catalog/services";

const Header = () => {
  const { maxPage } = useSelector(({ auth }) => auth),
    // { collections } = useSelector(({ services }) => services),
    { cluster, filtered } = useSelector(({ services }) => services),
    // [component, setComponent] = useState(""),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    dispatch(SetSERVICES({ filtered: Services.collections, maxPage }));
  }, [dispatch, maxPage]);

  const handleTemplate = (template) => dispatch(SetCLUSTER(template));

  const handleChange = (service) => {
    console.log("service", service);

    dispatch(SetFILTERED(service));
  };
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Services
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Templates setTemplate={handleTemplate} />
          <CustomSelect
            // CSS
            className="m-0 p-0 ml-4 text-white w-100 mdb-custom-select"
            inputClassName="text-white m-0 p-0"
            // Data
            collections={cluster}
            keys="id"
            multiple={true}
            // preValues={[5, 46]}
            // whitelisted={true}
            getObject={true}
            values="name"
            label="Service"
            preValue="Service"
            onChange={handleChange}
          />
          {/* <CustomSelect
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            choices={Templates.getComponents("LAB")}
          /> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

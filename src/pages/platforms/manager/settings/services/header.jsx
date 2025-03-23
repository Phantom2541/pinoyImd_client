import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { CustomSelect } from "../../../../../components/searchables";
import { SearchTemplates as Templates } from "../../../../../components/searchables";
import {
  BROWSE,
  RESET,
  SetCLUSTER,
  SetFILTERED,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { cluster, filtered } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  const handleTemplate = (template) => dispatch(SetCLUSTER(template));
  const handleChange = (service) => {
    console.log("handleChange service", service);

    dispatch(SetFILTERED(service));
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-content-end align-items-center">
        <span className="white-text font-weight-bold mr-2">Services:</span>
        <span className="font-weight-bold">{filtered.length}</span>
      </div>
      <div className="d-flex align-items-center" style={{ width: "30rem" }}>
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
          // getObject={true}
          values="name"
          label="Service"
          preValue="Service"
          onChange={handleChange}
        />
      </div>
    </MDBView>
  );
};

export default Header;

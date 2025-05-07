import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { SearchTemplates as Templates } from "../../../../../components/searchables";
import {
  BROWSE,
  RESET,
  SetCLUSTER,
  SetFILTEREDbyDEPARTMENT,
} from "../../../../../services/redux/slices/diagnostics/laboratory/preferences";
const Header = () => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { cluster, filtered } = useSelector(({ preferences }) => preferences),
    [department, setDepartment] = useState("LAB"),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));
    }

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  const handleTemplate = (template) =>
    dispatch(SetFILTEREDbyDEPARTMENT({ template, department }));
  const handleChange = (services) =>
    services.length > 0 && dispatch(SetCLUSTER(services));

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-content-end align-items-center">
        <span className="white-text font-weight-bold mr-2">Services:</span>
        <span className="font-weight-bold">{cluster.length}</span>
      </div>
      <div className="d-flex align-items-center ">
        <select
          onChange={(e) => setDepartment(e.target.value)}
          className="form-control mr-2 bg-light"
          style={{ width: "13rem" }}
        >
          <option>Choose a department</option>
          <option value="LAB">Laboratory</option>
          <option value="RAD">Radiology</option>
        </select>
        <Templates
          setTemplate={handleTemplate}
          Department={department}
          className="bg-light"
        />
        <div className="d-flex align-items-center" style={{ width: "20rem" }}>
          <Select
            // CSS
            className="m-0 p-0 ml-4 text-white w-100 mdb-custom-select"
            inputClassName="text-white m-0 p-0"
            // Data
            collections={filtered}
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
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

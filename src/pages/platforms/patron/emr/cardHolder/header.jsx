import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../../components/searchables";
import {
  SetFILTERED,
  SetCREATE,
  BROWSE,
} from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { BROWSE as COMPANYBROWSE } from "../../../../../services/redux/slices/assets/companies";
import { BROWSE as BRANCHBROWSE } from "../../../../../services/redux/slices/assets/branches";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { collections: companies } = useSelector(({ companies }) => companies);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(COMPANYBROWSE({ token }));
    }
  }, [dispatch, activePlatform, token]);

  const handleBranch = (branches) => {
    console.log("branches", JSON.parse(branches));

    setBranches(JSON.parse(branches));
  };

  return (
    <>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 px-4 mb-3 d-flex justify-content-between align-items-center"
      >
        {/* TABS + LABEL */}
        <div className="d-flex align-items-center gap-4">
          {/* Label */}
          <div className="text-white ml-4">Request Holder</div>
        </div>
        <div>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="company" className="text-white mb-0 mr-2">
              Company:
            </label>
            <select
              name="company"
              id="company"
              className="form-control form-control-sm"
              style={{ width: "200px" }}
              onChange={(e) => {
                handleBranch(e.target.value);
              }}
            >
              <option />
              {companies.map((company, index) => (
                <option
                  key={`${index}-company`}
                  value={JSON.stringify(company.branches)}
                >
                  {company.name} {company.subName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="company" className="text-white mb-0 mr-2">
              Branch: &nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <select
              name="branch"
              id="branch"
              className="form-control form-control-sm"
              style={{ width: "200px" }}
              onChange={(e) => {
                // console.log(e.target.value);
                dispatch(BROWSE({ token, key: { branchId: e.target.value } }));
                // handleOnboardings(e.target.value);
              }}
            >
              <option />
              {branches?.map((branch, index) => (
                <option key={`${index}-branch`} value={branch._id}>
                  {branch.name} {branch.subName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </MDBView>
    </>
  );
};

export default Header;

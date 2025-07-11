import { useDispatch, useSelector } from "react-redux";
import { MDBIcon, MDBView } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/commerce/pos/services/onBoardings";

import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);
  const [branches, setBranches] = useState([]);

  return (
    <>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 d-flex justify-content-between align-items-center"
      >
        <div className="text-white  py-2">
          <MDBIcon far icon="calendar-check" className="mr-2" />
          Schedule your diagnostic services today!
        </div>
        {/* <div className="d-flex align-items-center gap-2">
          <label htmlFor="company" className="text-white mb-0 mr-2">
            Branch:
          </label>
          <select
            name="branch"
            id="branch"
            className="form-control"
            style={{ width: "200px" }}
            onChange={(e) => {
              dispatch(BROWSE({ token, key: { branchId: e.target.value } }));
            }}
          >
            <option />
            {branches?.map((branch, index) => (
              <option key={`${index}-branch`} value={branch._id}>
                {branch.name} {branch.subName}
              </option>
            ))}
          </select>
        </div> */}
      </MDBView>
    </>
  );
};

export default Header;

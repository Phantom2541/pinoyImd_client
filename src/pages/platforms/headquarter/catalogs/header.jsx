import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../services/redux/slices/commerce/catalog/products";
import { SetActivePlatform } from "../../../../services/redux/slices/assets/persons/auth";

export default function Header() {
  const dispatch = useDispatch();

  // Destructure auth state
  const { token, branches = [], activePlatform } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          key: { branchId: activePlatform.branchId },
        })
      );
    }
  }, [token, activePlatform, dispatch]);

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    const selectedBranch = branches.find((branch) => branch._id === branchId) || null;
    dispatch(SetActivePlatform(selectedBranch));
  };

  return (
    <div className="d-flex align-items-center">
      <select
        className="form-control"
        value={activePlatform?.branchId || ""}
        onChange={handleBranchChange}
      >
        <option value="">-- Select Branch --</option>
        {branches.map((branch) => (
          <option key={branch._id} value={branch._id}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATALOG } from "../../../../services/redux/slices/commerce/catalog/products";
import { SetActivePlatform } from "../../../../services/redux/slices/assets/persons/auth";

export default function Header() {
  const dispatch = useDispatch();

  // Destructure auth state
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        CATALOG({
          token,
          key: { companyId: activePlatform.branch.company._id },
        })
      );
    }
  }, [token, activePlatform, dispatch]);

  return <div className="d-flex align-items-center"></div>;
}

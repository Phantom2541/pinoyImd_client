import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATALOG } from "../../../../services/redux/slices/commerce/catalog/products";

export default function Header() {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const keyPayload = activePlatform.company?._id
        ? { companyId: activePlatform.company._id }
        : { branchId: activePlatform.branchId };

      dispatch(CATALOG({ token, key: keyPayload })).unwrap()
        .then((res) => {
          console.log("CATALOG API response:", res);
        })
        .catch((err) => {
          console.error("CATALOG API error:", err);
        });
    }
  }, [token, activePlatform, dispatch]);

  return <h4>Products Catalog</h4>;
}

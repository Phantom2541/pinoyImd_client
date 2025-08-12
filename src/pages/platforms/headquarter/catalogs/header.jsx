import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Search } from "../../../../components/searchables";
import { SetFILTERED, CATALOG } from "../../../../services/redux/slices/commerce/catalog/products";

export default function Header({ onAdd }) {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, filtered } = useSelector(({ products }) => products);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const keyPayload = activePlatform.company?._id
        ? { companyId: activePlatform.company._id }
        : { branchId: activePlatform.branchId };

      dispatch(CATALOG({ token, key: keyPayload }))
        .unwrap()
        .then(() => {
          // After fetching, initialize filtered if empty
          if (!filtered || filtered.length === 0) {
            dispatch(SetFILTERED(collections));
          }
        })
        .catch((err) => {
          console.error("CATALOG API error:", err);
        });
    }
  }, [token, activePlatform, dispatch]);

  // Make sure filtered is initialized on collections change too
  useEffect(() => {
    if (collections.length > 0 && (!filtered || filtered.length === 0)) {
      dispatch(SetFILTERED(collections));
    }
  }, [collections, filtered, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient py-3 px-4 mb-3"
      style={{ borderRadius: "0.3rem" }}
    >
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="white-text m-0">{collections?.length || 0} Products</h5>

        <div
          className="d-flex align-items-center gap-2 mt-2 mt-md-0"
          style={{ minWidth: "300px" }}
        >
          <Search
            collections={collections}
            placeholder="Search products..."
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            reset={() => dispatch(SetFILTERED(collections))}
            hideButton={filtered?.length > 0} // hide + if has search results
            handleAdd={() => onAdd?.()}
          />
        </div>
      </div>
    </MDBView>
  );
}

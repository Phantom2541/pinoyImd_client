import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../components/searchables";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTERED,
  SetCREATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered = [], collections = [] } = useSelector(
    ({ clinicMenus }) => clinicMenus
  );
  const dispatch = useDispatch();

  const physicians = Array.isArray(activePlatform.branch.physicians)
    ? activePlatform.branch.physicians.map((p) => p._id)
    : [];

  useEffect(() => {
    if (token && physicians.length > 0) {
      dispatch(
        BROWSE({
          token,
          key: { physicianId: physicians }, // send all IDs
        })
      );
    }
  }, [token, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Clinic Menus
        </span>
      </div>
      <div className="d-flex items-center">
        <Search
          collections={collections}
          setFiltered={(items) => dispatch(SetFILTERED(items))}
          haveAction={true}
          reset={() => dispatch(SetFILTERED(collections))}
          hideButton={true}
          handleAdd={() => dispatch(SetCREATE())}
        />
      </div>
    </MDBView>
  );
};

export default Header;

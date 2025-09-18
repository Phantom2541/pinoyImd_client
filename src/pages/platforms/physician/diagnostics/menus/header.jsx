import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../components/searchables";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  SetFILTERED,
  RESET,
  SetCREATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
import { TIEUPS } from "../../../../../services/redux/slices/assets/persons/physicians";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered = [], collections = [] } = useSelector(
    ({ clinicMenus }) => clinicMenus
  );
  const { physicians } = useSelector(({ physicians }) => physicians);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(TIEUPS({ key: { branch: activePlatform?.branchId }, token }));

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  useEffect(() => {
    if (token && physicians.length > 0) {
      dispatch(
        BROWSE({
          token,
          key: { physicianId: physicians }, // send all IDs
        })
      );
    }
  }, [token, physicians, dispatch]);

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

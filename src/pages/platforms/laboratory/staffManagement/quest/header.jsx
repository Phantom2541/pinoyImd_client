import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTER,
  SetCREATE,
} from "../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Search } from "../../../../../components/searchables";
import Modal from "./modal"; // ✅ Tamang import na ito

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ quest }) => quest),
    dispatch = useDispatch();

  // Initial values
  useEffect(() => {
    if (token) {
      dispatch(
        BROWSE({ token, params: { branchId: activePlatform?.branchId } })
      );
    }
  }, [dispatch, token]);

  const handleAdd = () => {
    dispatch(SetCREATE());
  };

  // Refresh data function (para sa Modal)
  const refreshData = () => {
    dispatch(BROWSE({ token, params: { branchId: activePlatform?.branchId } }));
  };

  return (
    <>
      <MDBView
        cascade
        className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center position-relative"
      >
        <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
          <span className="white-text mx-3 text-nowrap mt-0">
            {collections?.length} Services
          </span>
        </div>

        {/* Centered Title */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="white-text font-weight-bold h5 mb-0">
            Mobile Clinic
          </span>
        </div>

        <div>
          <div className="text-right d-flex items-center">
            <Search
              collections={collections}
              hideButton={false}
              setFiltered={(items) => dispatch(SetFILTER(items))}
              placeholder="Search quest"
              haveAction={true}
              handleAdd={(item) => handleAdd(item)}
              reset={() => dispatch(SetFILTER(collections))}
            />
          </div>
        </div>
      </MDBView>
    </>
  );
};

export default Header;

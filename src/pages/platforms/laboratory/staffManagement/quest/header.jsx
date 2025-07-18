import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTER,
  SetCREATE,
} from "../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Search } from "../../../../../components/searchables";
import Modal from "./modal";
import { DateTime } from "luxon";

const Header = () => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, month, year } = useSelector(({ quest }) => quest);

  // ✅ Get current month/year using Luxon

  // ✅ Load data on mount
  // useEffect(() => {
  //   if (token && activePlatform?.branchId) {
  //     dispatch(
  //       BROWSE({
  //         token,
  //         params: {
  //           branchId: activePlatform.branchId,
  //           month,
  //           year,
  //         },
  //       })
  //     );
  //   }
  // }, [dispatch, token, activePlatform, month, year]);

  const handleAdd = () => {
    dispatch(SetCREATE());
  };

  // ✅ Refresh data with same month/year
  const refreshData = () => {
    dispatch(
      BROWSE({
        token,
        params: {
          branchId: activePlatform?.branchId,
          month,
          year,
        },
      })
    );
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
              handleAdd={handleAdd}
              reset={() => dispatch(SetFILTER(collections))}
            />
          </div>
        </div>
      </MDBView>

      {/* Optional: Modal with refresh */}
      <Modal refresh={refreshData} />
    </>
  );
};

export default Header;

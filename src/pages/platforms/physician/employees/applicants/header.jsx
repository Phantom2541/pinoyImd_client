import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/applicants";


const Header = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ applicants }) => applicants);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ data: { branchId: activePlatform.branchId }, token }));
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, activePlatform, dispatch]);

  // Emit search input back to parent
  useEffect(() => {
    if (typeof onSearch === "function") {
      onSearch(searchText);
    }
  }, [searchText, onSearch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 px-4 mb-3 d-flex justify-content-between align-items-center"
    >
      {/* Left Info */}
      <div className="text-white">
        <div className="font-weight-bold">{collections.length} Clinic Applicants</div>
      </div>

      {/* Right Search Bar */}
      <div style={{ maxWidth: "280px", width: "100%" }}>
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search applicant..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </MDBView>
  );
};

export default Header;

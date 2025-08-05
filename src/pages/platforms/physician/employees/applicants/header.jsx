import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { RESET } from "../../../../../services/redux/slices/assets/persons/physicians";
import { SECRETARY } from "../../../../../services/redux/slices/assets/persons/applicants";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ applicants }) => applicants),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        SECRETARY({ token, data: { branchId: activePlatform.branchId } })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, activePlatform, auth, dispatch]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 px-4 mb-3 d-flex justify-content-between align-items-center"
    >
      {/* Left Info */}
      <div className="text-white">
        <div className="font-weight-bold">
          {collections.length} Receptionist / Secretary Applicant
        </div>
      </div>

      {/* Right Search Bar */}
      <div style={{ maxWidth: "280px", width: "100%" }}>
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search applicant..."
        />
      </div>
    </MDBView>
  );
};

export default Header;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/assets/companies";

const Header = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ companies }) => companies),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    dispatch(BROWSE({ token }));
  }, [dispatch, token]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Companies
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center"></div>
      </div>
    </MDBView>
  );
};

export default Header;

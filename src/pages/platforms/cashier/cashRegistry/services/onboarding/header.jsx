import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
// import { Select } from "../../../../../../components/customizable";
import { INSOURCES } from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import { BROWSE } from "../../../../../../services/redux/slices/assets/persons/cardHolder";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
  }, [dispatch, token, activePlatform]);

  //initial values
  useEffect(() => {
    dispatch(
      INSOURCES({ token, keys: { branchId: activePlatform?.branchId } })
    );
  }, [dispatch, token, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} Onboarding KIOSK Request
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          {/* <Services template={template} setService={setService} /> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

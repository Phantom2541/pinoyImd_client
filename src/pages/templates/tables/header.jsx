import React from "react";
import { MDBView } from "mdbreact";
import Search from "../../../components/searchables/users";
// import {
//   RESET,
//   BROWSE,
//   SetCREATE,
// } from "../../../../../../services/redux/slices/liability/assurances";
const Header = () => {
  // const { token, activePlatform } = useSelector(({ auth }) => auth),
  //   dispatch = useDispatch();

  // useEffect(() => {
  //   if (token && activePlatform?.branchId) {
  //     dispatch(
  //       BROWSE({
  //         token,
  //         params: {
  //           branchId: activePlatform?.branchId,
  //         },
  //       })
  //     );
  //   }
  //   return () => dispatch(RESET());
  // }, [token, activePlatform, dispatch]);

  const setPatient = (patient) => {
    console.log("patient", patient);
  };
  const setRegister = (user) => {
    console.log("user", user);
  };

  return (
    <MDBView
      cascade
      style={{ position: "relative", overflow: "visible !important" }}
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Controls </span>
      </div>
      <Search setPatient={setPatient} setRegister={setRegister} />
    </MDBView>
  );
};

export default Header;

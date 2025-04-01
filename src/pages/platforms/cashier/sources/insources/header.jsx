import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  INSOURCE,
  SetSOURCE,
  ToggleModal,
  SetREGISTER,
} from "../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../components/searchables/sources";
import Swal from "sweetalert2";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    // console.log("Outside if");
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  const handleRegister = (displayname = "") => {
    dispatch(SetREGISTER({ displayname }));
  };

  const setSource = (source) => {
    const { name, displayname } = source;
    Swal.fire({
      title: `${name || ""} ${displayname || ""}`,
      text: `Do you want to register him as a new provider?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, register it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(SetSOURCE(source));
        dispatch(ToggleModal());
      }
    });
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Sources </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search setSource={setSource} handleRegister={handleRegister} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

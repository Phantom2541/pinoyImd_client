import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  BROWSE,
  SetSOURCE,
  RESET_COLLECTIONS,
  TOGGLE,
  SetREGISTER,
} from "../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../components/searchables/search";
import Swal from "sweetalert2";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          key: {
            vendors: activePlatform?.branchId,
            category: "hmo",
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
    const { displayname } = source;
    Swal.fire({
      title: `${displayname || ""}`,
      text: `Do you want to register as a new provider?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, register it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(SetSOURCE(source));
      } else {
        dispatch(RESET_COLLECTIONS());
      }
    });
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          Health Management Organizations{" "}
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Search hideButton={false} handleAdd={() => dispatch(TOGGLE())} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

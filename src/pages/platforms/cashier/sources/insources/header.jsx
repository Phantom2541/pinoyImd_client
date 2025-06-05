import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  INSOURCE,
  SetSOURCE,
  RESET_COLLECTIONS,
  SetREGISTER,
  SetCATEGORY,
} from "../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../components/searchables/sources";
import Swal from "sweetalert2";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { category, categories } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
            categories: ["insource", "hmo"],
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  const handleRegister = (name = "") => {
    dispatch(SetREGISTER({ name }));
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
        <span className="white-text mx-3 text-nowrap mt-0">Insource List </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <div className="d-flex align-items-center mr-4">
            <span className="mr-1">Category:</span>
            <select
              className="form-control bg-light"
              value={category}
              onChange={(e) => dispatch(SetCATEGORY(e.target.value))}
            >
              <option value="">All</option>
              {categories.map((c, index) => (
                <option key={index} value={c.value}>
                  {c.text}
                </option>
              ))}
            </select>
          </div>
          <Search setSource={setSource} handleRegister={handleRegister} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

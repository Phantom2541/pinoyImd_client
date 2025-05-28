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
  SetFILTER,
} from "../../../../../services/redux/slices/assets/providers";
import Search from "../../../../../components/searchables/sources";
import Swal from "sweetalert2";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ providers }) => providers),
    { category } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
            category: "insource",
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  useEffect(() => {
    const filter = collections.filter((item) => item.category === category);
    dispatch(SetFILTER(filter));
  }, [collections, category, dispatch]);

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

  const handleChangeCategory = (value) => {
    dispatch(SetCATEGORY(value));
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
          <div className="d-flex align-items-center mr-4">
            <span className="mr-1">Category:</span>
            <select
              className="form-control bg-light"
              value={category}
              onChange={(e) => handleChangeCategory(e.target.value)}
            >
              <option value="insource">Insource</option>
              <option value="hmo">Health Management Organization</option>
              <option value="sc">Subcontract</option>
              <option value="ssc">Special Subcontract</option>
            </select>
          </div>
          <Search setSource={setSource} handleRegister={handleRegister} />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

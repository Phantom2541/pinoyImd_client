import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  INSOURCE,
  SetSOURCE,
  RESET_COLLECTIONS,
  SetREGISTER,
} from "../../../../../services/redux/slices/assets/providers";
import {
  SetUPDATE,
  SetFILTER,
  SetHMO,
} from "../../../../../services/redux/slices/assets/companies";
import { Search } from "../../../../../components/searchables";
import Swal from "sweetalert2";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { hmo } = useSelector(({ companies }) => companies),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch,
    dispatch = useDispatch();
  console.log("hmo", hmo);

  const handleAdd = (item) => dispatch(SetUPDATE(item));

  useEffect(() => {
    if (companyId) {
      dispatch(SetHMO(companyId.hmo));
    }
  }, [companyId, dispatch]);

  // initial values
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        INSOURCE({
          token,
          key: {
            vendors: activePlatform?.branchId,
            categories: ["wns"],
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
        <span className="white-text mx-3 text-nowrap mt-0">
          Health Management Organization Partnerships
        </span>
      </div>
      <div>
        <div className="text-right d flex items-center">
          <Search
            collections={hmo}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search machines "
            haveAction={true}
            reset={() => dispatch(SetFILTER(hmo))}
            hideButton={false}
            handleAdd={(item) => handleAdd(item)}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

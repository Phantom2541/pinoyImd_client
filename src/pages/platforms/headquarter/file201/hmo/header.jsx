import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  INSOURCE,
} from "../../../../../services/redux/slices/assets/providers";
import {
  SetUPDATE,
  SetFILTER,
  SetHMO,
} from "../../../../../services/redux/slices/assets/companies";
import { Search } from "../../../../../components/searchables";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { hmo, closeModal } = useSelector(({ companies }) => companies),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch,
    dispatch = useDispatch();

  const handleAdd = (item) => dispatch(SetUPDATE(item));

  useEffect(() => {
    if (companyId) {
      dispatch(SetHMO(companyId.hmo));
    }
  }, [companyId, dispatch, closeModal]);

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

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {hmo.length} Accredited Health Management Organization
        </span>
      </div>
      <div>
        <div className="text-right d flex items-center">
          <Search
            collections={hmo}
            setFiltered={(items) => dispatch(SetFILTER(items))}
            placeholder="Search hmo "
            haveAction={true}
            reset={() => dispatch(SetFILTER(hmo))}
            hideButton={true}
            handleAdd={(item) => handleAdd(item)}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

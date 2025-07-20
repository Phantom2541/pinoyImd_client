import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import {
  RESET,
  TERMINATED,
  TOGGLE,
  SetFILTERED,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { employment } from "../../../../../services/utilities";
import Search from "../../../../../components/searchables/search";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const abbr = [...employment.employed].map(({ abbr }) => abbr);
      dispatch(
        TERMINATED({
          token,
          params: { branchId: activePlatform?.branchId, abbr },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center my-2"
        style={{ width: "20rem" }}
      >
        <span className="white-text mx-3 text-nowrap mt-0">
          Clearance Pay List
        </span>
      </div>
      <div>
        <Search
          collections={collections}
          handleAdd={() => dispatch(TOGGLE())}
          setFiltered={(results) => dispatch(SetFILTERED(results))}
          reset={() => dispatch(SetFILTERED(collections))}
        />
      </div>
    </MDBView>
  );
};

export default Header;

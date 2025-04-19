import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetFILTERED,
  SetSELECTED,
} from "../../../../services/redux/slices/assets/companies";
import Search from "../../../../components/searchables/search";

const Header = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, collections } = useSelector(({ companies }) => companies),
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
        <Search
          collections={collections}
          hideButton
          setFiltered={(results) =>
            dispatch(SetFILTERED(results.length > 0 ? results : collections))
          }
          handleAdd={(value) => dispatch(SetSELECTED({ name: value }))}
        />
      </div>
    </MDBView>
  );
};

export default Header;

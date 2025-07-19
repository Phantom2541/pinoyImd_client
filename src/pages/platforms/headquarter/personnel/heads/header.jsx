import React, { useEffect, useState } from "react";
import { Search } from "../../../../../components/searchables";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  RESET,
  SetFILTERED,
  SetCREATE,
} from "../../../../../services/redux/slices/assets/persons/heads";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth); //get the max page
  const { collections } = useSelector(({ heads }) => heads),
    [heads, setHeads] = useState([]),
    dispatch = useDispatch();
  console.log("collections", collections);

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    if (collections.length > 0) {
      const newArray = collections.map((collection) => ({
        ...collection,
        user: {
          ...collection?.user,
          department: collection?.department,
          section: collection?.section,
        },
      }));
      setHeads(newArray || []);
    }
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {heads.length} Sections Heads
        </span>
      </div>

      <div>
        <div className="text-right d-flex items-center">
          <Search
            collections={heads}
            setFiltered={(items) => dispatch(SetFILTERED(items))}
            placeholder="Search by name"
            haveAction={true}
            reset={() => dispatch(SetFILTERED(heads))}
            hideButton={true}
            handleAdd={(item) => dispatch(SetCREATE(item))}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

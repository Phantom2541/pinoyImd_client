import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  SetTAT,
  SetCREATE,
  SetFILTERED,
} from "../../../../../services/redux/slices/assets/branches";
import { Search } from "../../../../../components/searchables";

const Header = () => {
  const { activePlatform } = useSelector(({ auth }) => auth); //get the max page
  const { filtered, collections } = useSelector(({ branches }) => branches), //
    dispatch = useDispatch();
  console.log("activePlatform", activePlatform);

  const handleAdd = (item) => {
    dispatch(SetCREATE(item));
  };

  useEffect(() => {
    const { branch = {} } = activePlatform;

    dispatch(SetTAT(branch?.tat));
  }, [dispatch, activePlatform]);
  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} TAT Services
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        <select
          className="custom-select form-control form-control-sm"
          style={{ width: "150px" }}
        >
          <option value="1">Laboratory</option>
          <option value="2">Radiology</option>
          <option value="3">Clinic</option>
        </select>
        <Search
          collections={collections}
          setFiltered={(items) => dispatch(SetFILTERED(items))}
          placeholder="Search Services"
          haveAction={true}
          reset={() => dispatch(SetFILTERED(collections))}
          hideButton={true}
          handleAdd={(item) => handleAdd(item)}
        />
      </div>
    </MDBView>
  );
};

export default Header;

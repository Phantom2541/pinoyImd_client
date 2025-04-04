import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  FILTERBYCATEGORY,
  SetCREATE,
} from "../../../../../services/redux/slices/assets/providers";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, collections } = useSelector(({ providers }) => providers),
    [service, setService] = React.useState([]), // Initial state changed to an object (or define a default structure)
    dispatch = useDispatch();

  // Fetch hotlines on component mount and update filtered services based on the category
  useEffect(() => {
    if (token) {
      dispatch(
        FILTERBYCATEGORY({
          token,
          keys: { clients: activePlatform?.branchId, category: "hotline" },
        })
      );
    }
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    let uniqueSource = [];
    if (collections.length > 0)
      uniqueSource = [
        ...new Map(
          collections.map(({ source }) => [
            source?._id || "undefined",
            { _id: source?._id, name: source?.displayname || "" },
          ])
        ).values(),
      ];
    setService(uniqueSource);
  }, [collections]);
  // Handle Add function - make sure service is not empty before dispatching
  const handleAdd = (source) => {
    dispatch(SetCREATE(source));
    console.log("Set Create service :", source);
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {filtered.length} hotlines
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          {/* Button to add service */}
          {service?.map((token, index) => (
            <button
              onClick={() => handleAdd(service?.id)} // Pass service automatically to handleAdd
              className="btn btn-sm btn-primary"
            >
              Add
            </button>
          ))}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;

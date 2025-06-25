import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { APPLICATION } from "../../../../../services/redux/slices/assets/persons/personnels";
const Header = () => {
  const { token, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token) dispatch(APPLICATION({ token, data: { _id: auth._id } }));
  }, [dispatch, token, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4  d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center my-2"
        style={{ width: "20rem" }}
      >
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Applications
        </span>
      </div>
    </MDBView>
  );
};

export default Header;

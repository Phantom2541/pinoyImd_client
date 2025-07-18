import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCol, MDBIcon, MDBRow } from "mdbreact";
import Swal from "sweetalert2";
import { fullName } from "../../../../../../services/utilities";
import { UPDATE } from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
import "./style.css";

import PROFILE from "./../../../../../../assets/female.jpg";

export default function Collapsable({ team = [], _id }) {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const handleRemove = (member) => {
    const newTeam = team.filter((t) => t.userId._id !== member.userId._id);
    Swal.fire({
      title: `Remove ${fullName(member.userId.fullName)}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(UPDATE({ token, data: { _id, team: newTeam } }));
      }
    });
  };

  return (
    <>
      {/* <button
        className="btn btn-sm btn-primary rounded-pill d-flex align-items-center justify-content-center mx-auto"
        onClick={() => {
          dispatch(SetTeam({ _id, team }));
        }}
      >
        <i className="fa fa-plus mr-1" />
        Tag Member
      </button> */}
      <MDBRow>
        {team?.map((member, i) => (
          <MDBCol sm="1" key={`quest-${i}`} md="4" className="p-1">
            <div
              title={member?.hasInformed ? "Available" : "Unavailable"}
              className={`manager-quest-card ${
                member?.hasInformed ? "notified-yes" : "notified-no"
              }`}
            >
              <div className="manager-quest-card-header">
                <img
                  className="manager-quest-card-image"
                  src={PROFILE}
                  alt=""
                />
              </div>
              <div className="manager-quest-card-body">
                <span
                  title={fullName(member?.userId?.fullName)}
                  className="manager-quest-card-name"
                >
                  {fullName(member?.userId?.fullName)}
                </span>
                <span className="manager-quest-card-position">
                  {member?.role}
                </span>
                <span className="manager-quest-card-number">
                  {member?.userId?.phoneNumber}
                </span>
              </div>
              <button
                title="Remove from Group"
                className="manager-quest-card-button bg-danger"
                onClick={() => handleRemove(member)}
              >
                <MDBIcon fas icon="tag" />
              </button>
            </div>
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
}

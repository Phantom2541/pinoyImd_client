import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../../services/utilities";
import {
  SETSOURCE,
  SETPHYSICIAN,
} from "../../../../../../services/redux/slices/commerce/taskGenerator";
const Editable = ({ forwardedBy, physicianId, _id }) => {
  const { collections: physicians } = useSelector(
      ({ physicians }) => physicians
    ),
    { collections: sources } = useSelector(({ providers }) => providers),
    { source, physician } = useSelector(({ taskGenerator }) => taskGenerator),
    dispatch = useDispatch();

  const handleSource = (e) => {
    const { name, value } = e.target;
    dispatch(SETSOURCE({ source: value, _id }));
  };
  const handlePhysician = (e) => {
    const { name, value } = e.target;
    dispatch(SETPHYSICIAN({ physician: value, _id }));
  };

  return (
    <div>
      <div className="sales-card-info">
        <small>Source</small>
        <select
          name="source"
          onChange={handleSource}
          defaultValue={forwardedBy?._id}
          className="w-100"
        >
          <option value="-">-</option>
          {sources?.map(({ _id, name, vendors }) => (
            <option key={_id} value={vendors?._id}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="sales-card-info">
        <small>Referral</small>
        <select
          name="physician"
          defaultValue={physicianId?._id}
          onChange={handlePhysician}
          className="w-100"
        >
          <option value="-">-</option>
          {physicians?.map(({ user }) => (
            <option key={user?._id} value={user?._id}>
              {fullName(user?.fullName)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Editable;

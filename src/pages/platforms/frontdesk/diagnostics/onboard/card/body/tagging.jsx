import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../../../services/utilities";
import {
  SETSOURCE,
  SETPHYSICIAN,
} from "../../../../../../../services/redux/slices/commerce/taskGenerator";
const Editable = ({ forwardedBy, physicianId, _id }) => {
  const { collections: sources } = useSelector(({ providers }) => providers),
    [physicians, setPhysicians] = useState([]),
    dispatch = useDispatch();

  const handleSource = (e) => {
    const { value } = e.target;
    dispatch(SETSOURCE(value));
    const _physicians =
      sources?.find((source) => source._id.toString() === value.toString())
        ?.clients?.affiliated || []; // Ensure that `affiliated` is safe to access
    setPhysicians(_physicians); // Update the physicians list based on the filtered data
  };
  const handlePhysician = (e) => {
    const { value } = e.target;
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
          {sources?.map(({ _id, name, subName }) => (
            <option key={_id} value={_id}>
              {name?.toUpperCase()} {subName?.toUpperCase()}
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

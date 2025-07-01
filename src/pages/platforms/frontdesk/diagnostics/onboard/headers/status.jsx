import { useDispatch, useSelector } from "react-redux";
import { SetSTATUS } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { capitalize } from "lodash";

const choices = ["All", "Generated", "On process"];

const Status = () => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { activeStatus } = useSelector(({ taskGenerator }) => taskGenerator),
    dispatch = useDispatch();

  return (
    <div className="d-flex align-items-center">
      <select
        value={capitalize(activeStatus)}
        onChange={({ target }) =>
          dispatch(
            SetSTATUS({
              status: target.value,
              department: activePlatform?.department,
            })
          )
        }
        className="form-control w-auto cursor-pointer pr-5"
      >
        {choices?.map((choice, index) => {
          return (
            <option
              value={choice}
              key={`choices${index}`}
              className="text-capitalize"
            >
              {choice}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Status;

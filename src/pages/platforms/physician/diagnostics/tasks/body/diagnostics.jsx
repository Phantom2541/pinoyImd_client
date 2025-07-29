import { useDispatch, useSelector } from "react-redux";
import { Services } from "../../../../../../services/fakeDb";
import {
  SetTASK,
  SetSELECTED,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Diagnostics = ({ deal }) => {
  const { byGroup } = useSelector(({ validator }) => validator);
  const { diagnostic, customerId } = deal,
    dispatch = useDispatch();

  const handleRead = (_task, _form) => {
    const task = {
      ..._task,
      form: _form,
      patient: customerId,
    };
    dispatch(SetSELECTED({ deal }));
    dispatch(SetTASK({ task }));
  };

  const formattedPackges = (packages) => {
    return packages && typeof packages === "object"
      ? Array.isArray(packages)
        ? packages
        : Object.keys(packages).map((k) => Number(k))
      : packages
      ? [packages]
      : [];
  };
  const renderData = () => {
    const _diagnostics =
      byGroup === "all" ? diagnostic : { [byGroup]: diagnostic[byGroup] };
    return Object.entries(_diagnostics).map(([key, value], index) => {
      if (Array.isArray(value)) {
        return (
          <div key={index} className="mb-1">
            {value.map((item, idx) => (
              <div
                key={`${idx}-container-${item._id}`}
                className="cursor-pointer"
                style={{
                  textDecoration: item.hasRead ? "line-through" : "none",
                  textDecorationThickness: item.hasRead ? "2px" : "initial",
                }}
                onClick={() => handleRead({ ...item, dealId: deal._id }, key)}
              >
                <strong>
                  {index + 1}
                  {value.length > 1 ? `(${idx + 1})` : ""}. {key}:&nbsp;
                </strong>
                {Services.whereIn(formattedPackges(item.packages)).map(
                  ({ abbreviation }, i) => (
                    <span
                      pill
                      key={`${idx}-service-${i}`}
                      className="pt-1 mr-1"
                    >
                      {abbreviation}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className="mb-1 cursor-pointer"
            onClick={() => handleRead(value, key)}
            style={{
              textDecoration: value.hasRead ? "line-through" : "none",
              textDecorationThickness: value.hasRead ? "2px" : "initial",
            }}
          >
            <strong>
              {index + 1}.{key}: &nbsp;
            </strong>
            {Services.whereIn(formattedPackges(value.packages)).map(
              ({ abbreviation }, i) => (
                <span pill key={`-service-${i}`} className="pt-1 mr-1">
                  {abbreviation}
                </span>
              )
            )}
          </div>
        );
      }
    });
  };

  return <td>{renderData()}</td>;
};

export default Diagnostics;

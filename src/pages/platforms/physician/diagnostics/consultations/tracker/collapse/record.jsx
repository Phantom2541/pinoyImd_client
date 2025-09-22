import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPATIENT } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function CollapseTable({
  _key: key,
  form,
  obj,
  index,
  customer,
  branch,
  isSelected = false,
  setActiveSection = () => {},
}) {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const { isLoading } = useSelector(({ validator }) => validator);
  const { collections } = useSelector(({ preferences }) => preferences);
  const dispatch = useDispatch();

  const handleLabPrint = useCallback(
    (_obj) => {
      const task = formattedTask(_obj);
      const services = collections.filter(({ id }) =>
        task.services.includes(id)
      );
      const taskData = { ...task, services };

      // I-save sa localStorage
      localStorage.setItem("taskPrintout", JSON.stringify(taskData));

      // Dispatch event para marinig sa ibang component
      window.dispatchEvent(new Event("taskPrintout-change"));
      setActiveSection("");

      dispatch(
        SetPATIENT({
          ...appointment,
          activeDiag: {},
        })
      );
    },
    [collections] // ilagay sa dependencies ang collections dahil ginagamit sa loob ng function
  );

  useEffect(() => {
    if (isSelected && !isLoading) {
      handleLabPrint(obj);
    }
  }, [isSelected, isLoading, handleLabPrint, obj]);

  const formattedTask = (_obj) => {
    const {
      packages = [],
      hasDone = false,
      remarks = "",
      signatories = [],
    } = _obj;

    const _packages =
      packages && typeof packages === "object"
        ? Array.isArray(packages)
          ? packages
          : Object.keys(packages).map((k) => Number(k))
        : packages
        ? [packages]
        : [];

    const task = {
      ..._obj,
      _id: _obj._id || `${form}-${index}-${key}`,
      key: `${form}-${index}-${key}`,
      form,
      branchId: branch,
      patient: customer,
      generateHealthyClient: [
        "Urinalysis",
        "Parasitology",
        "Xray",
        "Ultrasound",
      ].includes(form),
      hasDone,
      remarks,
    };
    return {
      ...task,
      services: _packages,
      signatories,
    };
  };
  const { hasDone = false } = obj;

  if (!hasDone) return null;

  return (
    <>
      <div className="checkup-data-tracker-item-container" key={key}>
        <span
          className="checkup-data-tracker-item"
          onClick={() => handleLabPrint(obj)}
        >
          {form}
        </span>
      </div>
    </>
  );
}

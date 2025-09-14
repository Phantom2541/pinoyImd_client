import { useSelector } from "react-redux";

export default function CollapseTable({
  key,
  form,
  obj,
  index,
  customer,
  branch,
}) {
  const { collections } = useSelector(({ preferences }) => preferences);

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    const taskData = { ...task, services };
    localStorage.setItem("taskPrintout", JSON.stringify(taskData));
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services })
    );
    // dispatch event para marinig sa ibang component
    window.dispatchEvent(new Event("taskPrintout-change"));
  };

  const {
    packages = [],
    hasDone = false,
    remarks = "",
    signatories = [],
  } = obj;

  const _packages =
    packages && typeof packages === "object"
      ? Array.isArray(packages)
        ? packages
        : Object.keys(packages).map((k) => Number(k))
      : packages
      ? [packages]
      : [];

  const task = {
    ...obj,
    _id: obj._id || `${form}-${index}-${key}`,
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

  const _task = {
    ...task,
    services: _packages,
    signatories,
  };
  if (!hasDone) return null;

  return (
    <>
      <div className="checkup-data-tracker-item-container" key={key}>
        <span
          className="checkup-data-tracker-item"
          onClick={() => handleLabPrint(_task)}
        >
          {form}
        </span>
      </div>
    </>
  );
}

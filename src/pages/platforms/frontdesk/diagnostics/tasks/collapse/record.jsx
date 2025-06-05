import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../../services/utilities/index.js";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb/index.js";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

const Tasks = ({ _id, form, obj, index, customer }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    const taskData = { ...task, services };

    // Store data in localStorage
    localStorage.setItem("taskPrintout", JSON.stringify(taskData));
    console.log("Data stored in localStorage:", taskData);

    // Construct the URL
    const URL = `${window.location.origin}/printout/laboratory/task`;
    const title = `Laboratory Task Printout`;
    const features = "top=100px,left=100px,width=794px,height=1123px";

    console.log("Current Window Location:", window.location);
    console.log("Origin:", window.location.origin);
    console.log("URL:", URL);

    setTimeout(() => {
      const printWindow = window.open(URL, title, features);

      if (printWindow) {
        console.log("Print window opened successfully.");
        console.log("Print window location:", printWindow.location.href);
        printWindow.focus();
      } else {
        console.warn("Popup blocked or failed to open.");
      }
    }, 100);
  };

  const handleRadPrint = (task) => {
    const services = Services.find(task.services);
    localStorage.setItem("taskPrintout", JSON.stringify({ ...task, services }));
    window.open(
      "/printout/radiology/task",
      "Radiology Task Printout",
      "top=100px,left=100px,width=794px,height=1123px"
    );
  };

  const {
    packages = [],
    hasDone = false,
    remarks = "",
    signatories = [],
  } = obj;

  // object : chem
  // array : urinalysis, hema
  // string : xray
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
    key: `${form}-${index}`,
    form,
    patient: customer,
    generateHealthyClient: [
      "Urinalysis",
      "Parasitology",
      "Xray",
      "Ultrasound",
    ].includes(form)
      ? true
      : false,
    hasDone,
    remarks,
  };

  const handleEntry = () => dispatch(SetTASK({ task }));

  const isEmptyEntry = _packages.length === 0;

  return (
    <tr key={task.key} className={hasDone ? "table-active" : ""}>
      <td>
        {index}.{signatories[0]?.fullName && fullName(signatories[0]?.fullName)}
      </td>
      <td>{form}</td>
      <td>
        {isEmptyEntry ? (
          <MDBBadge color="danger" pill>
            No services
          </MDBBadge>
        ) : (
          Services.whereIn(_packages).map(({ abbreviation }, i) => (
            <MDBBadge pill key={`${task.key}-service-${i}`} className="pt-1">
              {abbreviation}
            </MDBBadge>
          ))
        )}
      </td>
      <td>
        <MDBBtnGroup>
          <MDBBtn
            onClick={handleEntry}
            color={hasDone ? "info" : "primary"}
            size="sm"
            className="py-1 px-2 m-0"
          >
            <MDBIcon icon={hasDone ? "pencil-alt" : "list-alt"} />
          </MDBBtn>
          {!!signatories.length &&
            signatories[0] &&
            signatories[1] &&
            hasDone && (
              <MDBBtn
                onClick={() => {
                  const selected = {
                    ...task,
                    branchId: activePlatform?.branch,
                    services: _packages,
                    signatories,
                    isPrint: true,
                  };
                  activePlatform.department === "Laboratory"
                    ? handleLabPrint(selected)
                    : handleRadPrint(selected);
                }}
                color="warning"
                size="sm"
                className="py-1 px-2 m-0"
              >
                <MDBIcon icon="print" />
              </MDBBtn>
            )}
        </MDBBtnGroup>
      </td>
    </tr>
  );
};

export default Tasks;

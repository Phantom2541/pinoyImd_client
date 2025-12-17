import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../services/utilities/index.js";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../services/fakeDb/index.js";
import {
  SetTASK,
  SetWorkArea,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import LIS_STATUS from "../lis-status.jsx";

const Tasks = ({ key, form, obj, index, customer, deal }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    const taskData = { ...task, services };
    localStorage.setItem("taskPrintout", JSON.stringify(taskData));
    const URL = `${window.location.origin}/printout/laboratory/task`;
    const features = "top=100px,left=100px,width=794px,height=1123px";
    setTimeout(() => {
      const printWindow = window.open(
        URL,
        "Laboratory Task Printout",
        features
      );
      if (printWindow) {
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

  const LIS_SENDER = () => {
    dispatch(SetWorkArea({ ...deal, task: obj, section: form }));
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
    key: `${form}-${index} -${key}`,
    form,
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

  // console.log("record task", task);

  const handleEntry = () => dispatch(SetTASK({ task }));

  const isEmptyEntry = _packages.length === 0;

  return (
    <tr key={task.key} className={hasDone ? "table-active" : ""}>
      <td>{index}</td>
      <td>
        {signatories[0]?.fullName ? fullName(signatories[0].fullName) : "-"}
      </td>
      <td>
        {signatories[1]?.fullName ? fullName(signatories[1].fullName) : "-"}
      </td>
      <td>
        {form}
        <LIS_STATUS workarea={obj.workarea} />
      </td>
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
            color="dark"
            size="sm"
            className="py-1 px-2 m-0"
            onClick={LIS_SENDER}
          >
            <MDBIcon icon="tools" />
          </MDBBtn>

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

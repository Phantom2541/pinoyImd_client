import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import {
  SetTASK,
  SetSELECTED,
  SetWorkArea,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { fullName } from "../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import LIS_STATUS from "../lis-status";

const Patient = ({ obj, customer, form, _key: key, index, deal }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    { packages = [], hasDone = false, remarks = "", signatories = [] } = obj,
    dispatch = useDispatch();

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    const taskData = { ...task, services };

    // Store data in localStorage
    localStorage.setItem("taskPrintout", JSON.stringify(taskData));

    // Construct the URL
    const URL = `${window.location.origin}/printout/laboratory/task`;
    const title = `Laboratory Task Printout`;
    const features = "top=100px,left=100px,width=794px,height=1123px";

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

  const handleEntry = (task, deal) => {
    dispatch(SetSELECTED({ deal }));
    dispatch(SetTASK({ task }));
  };

  const _packages =
    packages && typeof packages === "object"
      ? Array.isArray(packages)
        ? packages
        : Object.keys(packages).map((k) => Number(k))
      : packages
      ? [packages]
      : [];

  const _task = {
    ...obj,
    key: `${index}-${form}`,
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
  const LIS_SENDER = () => {
    dispatch(SetWorkArea({ ...deal, task: obj, section: form }));
  };

  return (
    <tr key={key}>
      <td>{index}</td>
      <td>
        {fullName(customer?.fullName) || "Unnamed Patient"}
        <LIS_STATUS workarea={obj.workarea} />
      </td>
      <td>
        {_packages.length === 0 ? (
          <MDBBadge color="danger" pill>
            No services
          </MDBBadge>
        ) : (
          Services.whereIn(_packages).map(({ abbreviation }, i) => (
            <MDBBadge
              pill
              key={`${_task.key}-service-${i}`}
              className="pt-1 mr-1"
            >
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
            onClick={() => handleEntry(_task, deal)}
            color={hasDone ? "info" : "primary"}
            size="sm"
            className="py-1 px-2 m-0"
          >
            <MDBIcon icon={hasDone ? "pencil-alt" : "list-alt"} />
          </MDBBtn>
          {!!signatories?.length &&
            signatories[0] &&
            signatories[1] &&
            hasDone && (
              <MDBBtn
                onClick={() => {
                  const selected = {
                    ..._task,
                    branchId: activePlatform?.branch,
                    services: _packages,
                    signatories,
                    isPrint: true,
                  };
                  activePlatform?.department === "Laboratory"
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

export default Patient;

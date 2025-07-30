import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb";
import {
  SetTASK,
  SetSELECTED,
  SetVALIDATOR,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { fullName } from "../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  LABRESULT,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals";
import Spinner from "../../../../../../components/spinner";

const Patient = ({ obj, customer, form, _key: key, index, deal }) => {
  const { activePlatform, auth, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    { heads } = useSelector(({ validator }) => validator),
    { collections: physicians } = useSelector(({ physicians }) => physicians),
    { formSubmitted } = useSelector(({ deals }) => deals),
    { packages = [], hasDone = false, remarks = "", signatories = [] } = obj,
    [selected, setSelected] = useState({}),
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

  const handleSelected = (data) => {
    if (selected?._id === data._id && selected.key === data.key) {
      setSelected({});
    } else {
      setSelected(data);
    }
  };

  const [head, dr, encoder = auth?._id] = _task?.signatories || [];

  const handlePick = (isTechnician = true) => {
    if (!selected[isTechnician ? "signatory1" : "signatory2"])
      return setSelected({});
    const updatedTask = {
      ..._task,
      signatories: [
        isTechnician ? selected?.signatory1 : head?._id,
        !isTechnician ? selected?.signatory2 : dr?._id,
        encoder?._id,
      ],
      department: "Radiology",
    };
    dispatch(
      LABRESULT({
        token,
        data: updatedTask,
      })
    ).then(({ payload }) => {
      dispatch(SetVALIDATOR(payload?.item || payload?.payload));
      dispatch(RESET());
      setSelected({});
    });
  };
  console.log("signatories", signatories);

  return (
    <tr key={key}>
      <td>{index}</td>
      <td>
        {selected?._id === _task._id && selected.key === "signatory1" ? (
          <div
            style={{ width: "13rem" }}
            className="d-flex gap-2 align-items-center"
          >
            <select
              className="form-control form-control-sm mt-2"
              value={selected?.signatory1 || ""}
              onChange={(e) =>
                setSelected({ ...selected, signatory1: e.target.value })
              }
            >
              <option value="">Select Technician</option>
              {heads
                .filter(
                  ({ section }) => section.toLowerCase() === form.toLowerCase()
                )
                .map(({ user }) => (
                  <option key={user._id} value={user._id}>
                    {fullName(user.fullName)}
                  </option>
                ))}
            </select>
            {formSubmitted ? (
              <Spinner formSubmitted className="mx-2" />
            ) : (
              <i
                className="fas fa-check-circle text-success mx-1"
                role="button"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
                title="Save"
                onClick={() => handlePick(true)}
              ></i>
            )}
            <i
              className="fas fa-times-circle text-danger"
              role="button"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              title="Cancel"
              onClick={() => setSelected({})}
            ></i>
          </div>
        ) : (
          <strong
            onClick={() =>
              handleSelected({
                ..._task,
                key: "signatory1",
                signatory1: signatories[0]?._id,
              })
            }
            style={{ cursor: "pointer" }}
          >
            {signatories[0]?.fullName
              ? fullName(signatories[0].fullName)
              : "pick a Technician"}
          </strong>
        )}
      </td>

      <td>
        {selected?._id === _task._id && selected.key === "signatory2" ? (
          <div
            style={{ width: "13rem" }}
            className="d-flex gap-2 align-items-center"
          >
            <select
              className="form-control form-control-sm mt-2"
              value={selected?.signatory2 || ""}
              onChange={(e) =>
                setSelected({ ...selected, signatory2: e.target.value })
              }
            >
              <option value="">Select Radiologist</option>
              {physicians
                .filter(
                  ({ specialization }) => specialization === "Radiologist"
                )
                .map(({ user }) => (
                  <option key={user._id} value={user._id}>
                    {fullName(user.fullName)}
                  </option>
                ))}
            </select>
            {formSubmitted ? (
              <Spinner formSubmitted className="mx-2" />
            ) : (
              <i
                className="fas fa-check-circle text-success mx-1"
                role="button"
                style={{ fontSize: "1.2rem", cursor: "pointer" }}
                title="Save"
                onClick={() => handlePick(false)}
              ></i>
            )}
            <i
              className="fas fa-times-circle text-danger"
              role="button"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              title="Cancel"
              onClick={() => setSelected({})}
            ></i>
          </div>
        ) : (
          <strong
            onClick={() =>
              handleSelected({
                ..._task,
                key: "signatory2",
                signatory2: signatories[1]?._id,
              })
            }
            style={{ cursor: "pointer" }}
          >
            {signatories[1]?.fullName
              ? fullName(signatories[1].fullName)
              : "pick a Radiologist"}
          </strong>
        )}
      </td>

      <td>{fullName(customer?.fullName) || "Unnamed Patient"}</td>
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

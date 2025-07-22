import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../../services/utilities/index.js";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb/index.js";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import Swal from "sweetalert2";
import { LABRESULT } from "../../../../../../services/redux/slices/commerce/pos/services/deals.js";
import { Input } from "../../../../../../components/customizable";

const Tasks = ({ key, form, obj, index, customer }) => {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    [selected, setSelected] = useState({}),
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
      if (printWindow) printWindow.focus();
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

  const extractDriveFileId = (url) => {
    try {
      const regex = /[-\w]{25,}/;
      const match = url.match(regex);
      return match ? match[0] : null;
    } catch {
      return null;
    }
  };

  const previewDriveFile = async (task) => {
    const { value: link } = await Swal.fire({
      title: "Paste Google Drive Link",
      input: "text",
      inputLabel: "Google Drive File Link",
      inputPlaceholder:
        "e.g. https://drive.google.com/file/d/FILE_ID/view?usp=sharing",
      showCancelButton: true,
    });

    if (link) {
      const fileId = extractDriveFileId(link);
      if (!fileId) {
        Swal.fire({
          icon: "error",
          title: "Invalid Link",
          text: "Could not extract File ID. Please check your link.",
        });
        return;
      }

      const previewLink = `https://drive.google.com/file/d/${fileId}/preview`;

      const result = await Swal.fire({
        title: "Google Drive Preview",
        html: `
          <iframe src="${previewLink}" width="100%" height="400" frameborder="0" allow="autoplay"></iframe>
        `,
        width: 600,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Save Link",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const updatedTask = {
          ...task,
          fileId: link,
          department: "Radiology",
        };

        dispatch(LABRESULT({ token, data: updatedTask }));

        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "The link has been saved in fileId with department set.",
        });
      }
    }
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

  const handleEntry = () => dispatch(SetTASK({ task }));

  const isEmptyEntry = _packages.length === 0;

  const handleSelected = (data) => {
    if (selected?._id === data._id && selected.key === data.key) {
      setSelected({});
    } else {
      setSelected(data);
    }
  };

  // const isSelected =
  //   selected?._id === task._id && selected?.key === "signatory";

  return (
    <tr key={task.key} className={hasDone ? "table-active" : ""}>
      <td>{index}</td>
      <td>
        {selected?._id === task._id && selected.key === "signatory1" ? (
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
              {collections
                .filter((user) => user.role === "Technician")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {fullName(user.fullName)}
                  </option>
                ))}
            </select>
            <i
              className="fas fa-check-circle text-success"
              role="button"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              title="Save"
              onClick={() => handleEntry(selected)}
            ></i>
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
            onClick={() => handleSelected({ ...task, key: "signatory1" })}
            style={{ cursor: "pointer" }}
          >
            {signatories[0]?.fullName
              ? fullName(signatories[0].fullName)
              : "pick a Technician"}
          </strong>
        )}
      </td>

      <td>
        {selected?._id === task._id && selected.key === "signatory2" ? (
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
              {collections
                .filter((user) => user.role === "Radiologist")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {fullName(user.fullName)}
                  </option>
                ))}
            </select>
            <i
              className="fas fa-check-circle text-success"
              role="button"
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              title="Save"
              onClick={() => handleEntry(selected)}
            ></i>
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
            onClick={() => handleSelected({ ...task, key: "signatory2" })}
            style={{ cursor: "pointer" }}
          >
            {signatories[1]?.fullName
              ? fullName(signatories[1].fullName)
              : "pick a Radiologist"}
          </strong>
        )}
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
          {["Xray", "Ultrasound", "ECG"].includes(form) ? (
            <MDBBtn
              color="dark"
              size="sm"
              className="py-1 px-2 m-0"
              onClick={() => previewDriveFile(task)}
            >
              <MDBIcon icon="eye" />
            </MDBBtn>
          ) : (
            <MDBBtn
              onClick={handleEntry}
              color={hasDone ? "info" : "primary"}
              size="sm"
              className="py-1 px-2 m-0"
            >
              <MDBIcon icon={hasDone ? "pencil-alt" : "list-alt"} />
            </MDBBtn>
          )}

          {!!signatories.length &&
            signatories[0] &&
            signatories[1] &&
            hasDone && (
              <MDBBtn
                onClick={() => {
                  const selectedTask = {
                    ...task,
                    branchId: activePlatform?.branch,
                    services: _packages,
                    signatories,
                    isPrint: true,
                  };
                  activePlatform.department === "Laboratory"
                    ? handleLabPrint(selectedTask)
                    : handleRadPrint(selectedTask);
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

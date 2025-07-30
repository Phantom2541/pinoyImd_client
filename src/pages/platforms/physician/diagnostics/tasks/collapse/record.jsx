import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fullName } from "../../../../../../services/utilities/index.js";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb/index.js";
import {
  SetRAD_READER,
  SetTASK,
  SetVALIDATOR,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import Swal from "sweetalert2";
import {
  LABRESULT,
  RESET,
} from "../../../../../../services/redux/slices/commerce/pos/services/deals.js";
import Spinner from "../../../../../../components/spinner/index.jsx";

const Tasks = ({ key, form, obj, index, customer }) => {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    { formSubmitted } = useSelector(({ deals }) => deals),
    { collections } = useSelector(({ preferences }) => preferences),
    { heads } = useSelector(({ validator }) => validator),
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
          fileId,
          department: "Radiology",
        };

        dispatch(
          LABRESULT({
            token,
            data: updatedTask,
          })
        ).then(({ payload }) => {
          dispatch(SetVALIDATOR(payload?.item || payload?.payload));
        });

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
  let _packages = packages;
  if (packages && typeof packages === "object") {
    if (Array.isArray(packages)) {
      _packages = packages;
    } else {
      _packages = Object.keys(packages).map((k) => Number(k));
    }
  } else if (packages) {
    _packages = [packages];
  }
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

  const [head, dr, encoder = auth?._id] = task?.signatories || [];

  const handlePick = (isTechnician = true) => {
    if (!selected[isTechnician ? "signatory1" : "signatory2"])
      return setSelected({});
    const updatedTask = {
      ...task,
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
                ...task,
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
            color="dark"
            size="sm"
            className="py-1 px-2 m-0"
            onClick={() =>
              task.fileId
                ? dispatch(SetRAD_READER(task))
                : previewDriveFile(task)
            }
          >
            <MDBIcon icon={task.fileId ? "eye" : "upload"} />
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

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  capitalize,
  fullName,
} from "../../../../../../services/utilities/index.js";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services } from "../../../../../../services/fakeDb/index.js";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

const Tasks = ({ _id, form, obj = {}, index, customer }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const department = activePlatform.department === "laboratory" ? "LAB" : "RAD";
  const isCluster = ["Miscellaneous", "Xray"].includes(form);
  // Ensure formEntries is an array even if obj is null or malformed
  const formEntries = isCluster
    ? Array.isArray(obj)
      ? obj.length > 0
        ? obj
        : [{}] // empty array becomes [{}] for at least one row
      : obj
      ? [obj]
      : [{}]
    : [obj || {}];

  const handlePrint = (task) => {
    const services = Services.whereIn(task.services).map(({ id, ...rest }) => {
      const range = collections.filter(({ serviceId }) => serviceId === id);
      return { ...rest, id, range };
    });

    localStorage.setItem("taskPrintout", JSON.stringify({ ...task, services }));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return formEntries.map((entry, entryIndex) => {
    const {
      packages = [],
      hasDone = false,
      remarks = "",
      signatories = [],
    } = entry || {};

    const _packages =
      packages && typeof packages === "object"
        ? Array.isArray(packages)
          ? packages
          : Object.keys(packages).map((k) => Number(k))
        : packages
        ? [packages]
        : [];
    const task = {
      ...entry,
      key: `${form}-${index}-${entryIndex}`,
      _id,
      dealId: _id,
      form,
      patient: customer,
      generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
      hasDone,
      remarks,
      department,
    };

    const handleEntry = () => dispatch(SetTASK({ task, form }));

    const isEmptyEntry = _packages.length === 0;

    return (
      <tr key={task.key} className={hasDone ? "table-active" : ""}>
        <td>
          {index + 1}
          {isCluster ? `.${entryIndex + 1}` : ""}{" "}
          {fullName(signatories[0]?.fullName || "N/A")}
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
                  onClick={() =>
                    handlePrint({
                      ...task,
                      branchId: activePlatform?.branch,
                      services: _packages,
                      signatories,
                      isPrint: true,
                    })
                  }
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
  });
};

export default Tasks;

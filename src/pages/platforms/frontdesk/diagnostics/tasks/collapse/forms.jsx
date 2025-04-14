import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

const Forms = ({ form, obj, index, customer }) => {
  const { preferences } = useSelector(({ validator }) => validator),
    { activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  const { department } =
    activePlatform.department === "laboratory" ? "LAB" : "RAD";

  const isCluster = ["Miscellaneous", "Xray"].includes(form);
  const formEntries = isCluster ? obj : [obj]; // If Miscellaneous, map multiple; otherwise, use single object

  const handlePrint = (task) => {
    localStorage.setItem("taskPrintout", JSON.stringify(task));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return formEntries.map((entry, entryIndex) => {
    const { packages, hasDone = false, remarks = "", signatories = [] } = entry;
    // Ensure packages is always an array to prevent TypeError
    const _packages =
      packages && typeof packages === "object"
        ? Array.isArray(packages)
          ? packages
          : Object.keys(packages).map((k) => Number(k))
        : [packages];

    const task = {
      ...entry,
      key: `${form}-${index}-${entryIndex}`,
      form,
      patient: customer,
      generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
      hasDone,
      remarks,
      department,
    };

    const handleEntry = () => dispatch(SetTASK({ task, form }));

    return (
      <tr key={task.key} className={`${hasDone && "table-active"}`}>
        <td>
          {index + 1}
          {isCluster ? `.${entryIndex + 1}` : ""} {capitalize(form)}
        </td>
        <td>{form}</td>
        <td>
          {Services.whereIn(_packages).map(({ abbreviation }, i) => (
            <MDBBadge pill key={`${task.key}-service-${i}`} className="pt-1">
              {abbreviation}
            </MDBBadge>
          ))}
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
                      services: Services.whereIn(_packages),
                      preferences,
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

export default Forms;

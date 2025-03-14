import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { capitalize } from "../../../../../../services/utilities";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

const Forms = ({ form, obj, index }) => {
  const { preferences } = useSelector(({ validator }) => validator),
    { activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  const { packages, hasDone = false, remarks = "", signatories = [] } = obj;

  const handlePrint = (task) => {
    localStorage.setItem("taskPrintout", JSON.stringify(task));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px" // size of the page that will open
    );
  };

  // Find the template that contains this form
  const foundTemplate = Templates.collections.find(({ components }) =>
    components.includes(form)
  );

  if (!foundTemplate) {
    console.warn(`⚠️ No template found for form: ${form}`);
    return null; // Skip this row to prevent undefined errors
  }

  const { department } = foundTemplate;

  const _packages = Array.isArray(packages)
    ? packages
    : Object.keys(packages).map((k) => Number(k));

  const task = {
    ...obj,
    key: `${form}-${index}`,
    form,
    generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
    hasDone,
    remarks,
    department,
  };

  const handeEntry = (task) => dispatch(SetTASK(task));

  return (
    <tr key={task.key} className={`${hasDone && "table-active"}`}>
      <td>
        {index + 1}. {capitalize(form)}
      </td>
      <td>{form}</td>
      <td>
        {Services.whereIn(_packages).map(({ abbreviation }, index) => (
          <MDBBadge pill key={`${task.key}-service-${index}`} className="pt-1">
            {abbreviation}
          </MDBBadge>
        ))}
      </td>
      <td>
        <MDBBtnGroup>
          <MDBBtn
            onClick={() => handeEntry(task)}
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
};

export default Forms;

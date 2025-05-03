import React, { useState } from "react";
import { capitalize } from "./../../../../../../services/utilities";
import { Services, Templates } from "./../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

export default function CollapseTable({ menu }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    [task, setTask] = useState({}),
    [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    console.log(task);

    setShowModal(!showModal);
  };

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    localStorage.setItem("taskPrintout", JSON.stringify({ ...task, services }));

    const URL = "/printout/laboratory/task",
      title = `Laboratory Task Printout`,
      features = "top=100px,left=100px,width=794px,height=1123px";

    const printWindow = window.open(URL, title, features);
    printWindow.focus();
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

  const handleIndividual = (form, obj = {}, index, miscIndex = 0) => {
    const { department } = Templates.findByComponentName(form);

    const _packages = Array.isArray(obj?.packages)
      ? obj.packages
      : Object.keys(obj?.packages || {}).map(Number);
    var task = {
      ...obj,
      key: `${form}-${index}`,
      form,
      generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
      patient: customerId,
      source: source || {},
      hasDone: obj?.hasDone,
      category,
      id: _id,
      remarks: obj?.remarks,
      department,
      miscIndex,
    };

    return (
      <tr key={task.key}>
        {/* remove by darrel className={`${hasDone && "table-active"}`} */}
        <td className="fw-bold">
          {capitalize(department)}{" "}
          {obj?.hasDone && (
            <MDBBadge color="success" className="ml-2">
              Done
            </MDBBadge>
          )}
        </td>
        <td>
          {capitalize(form)}{" "}
          {obj?.hasDone && <MDBIcon icon="check" className="ml-1" />}
        </td>
        <td>
          {Services.whereIn(_packages).map(({ abbreviation }, index) => (
            <MDBBadge
              pill
              key={`${task.key}-service-${index}`}
              className="pt-1"
            >
              {abbreviation}
            </MDBBadge>
          ))}

          {obj?.hasDone && <MDBIcon icon="check" className="ml-1" />}
        </td>
        <td>
          <MDBBtnGroup>
            <MDBBtn
              title="Modal"
              rounded
              onClick={() => {
                setTask(task);
                toggleModal();
              }}
              color={obj?.hasDone ? "info" : "primary"}
              size="sm"
              className="py-1 px-3 m-0"
            >
              <MDBIcon icon={obj?.hasDone ? "pencil-alt" : "list-alt"} />
            </MDBBtn>
            {!!obj?.signatories.length &&
              obj?.signatories[0] &&
              obj?.signatories[1] &&
              obj?.hasDone && (
                <MDBBtn
                  rounded
                  onClick={() => {
                    const _task = {
                      ...task,
                      branchId: activePlatform?.branch,
                      referral: physicianId || {},
                      services: _packages,
                      signatories: obj?.signatories,
                      isPrint: true,
                    };
                    activePlatform.department === "laboratory"
                      ? handleLabPrint(_task)
                      : handleRadPrint(_task);
                  }}
                  color="warning"
                  size="sm"
                  className="py-1 px-3 m-0"
                >
                  <MDBIcon icon="print" />
                </MDBBtn>
              )}
          </MDBBtnGroup>
        </td>
      </tr>
    );
  };

  const {
    customerId,
    physicianId,
    source,
    category,
    _id,
    diagnostics = [],
  } = menu;

  return (
    <>
      <MDBTable small hover responsive bordered className="w-100">
        <thead>
          <tr>
            <th>Department</th>
            <th>Template</th>
            <th>Services</th>
            <th>Action </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {diagnostics &&
            diagnostics?.map((diagnostic, index) => {
              // const result = results?.[form.key.toLowerCase()];
              // if (!result)
              //   return (
              //     <tr key={task.key}>
              //       <td colSpan={4}>Empty Test</td>
              //     </tr>
              //   );

              if (Array.isArray(diagnostic.result))
                return diagnostic.result.map((obj, i) =>
                  handleIndividual(diagnostic.key, obj, index + i, i)
                );

              return handleIndividual(
                diagnostic.key.toLowerCase(),
                diagnostic.result,
                index
              );
            })}
        </tbody>
      </MDBTable>
    </>
  );
}

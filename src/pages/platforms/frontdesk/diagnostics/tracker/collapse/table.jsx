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

  const toggleModal = () => setShowModal(!showModal);

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

  const handleIndividual = (form, obj, index, miscIndex = 0) => {
    const { packages, hasDone = false, remarks = "", signatories = [] } = obj,
      { department } = Templates.findByComponentName(form);

    console.log("department", department);

    const _packages = Array.isArray(packages)
      ? packages
      : Object.keys(packages).map((k) => Number(k));

    var task = {
      ...obj,
      key: `${form}-${index}`,
      form,
      generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
      patient: customerId,
      source: source || {},
      hasDone,
      category,
      id: _id,
      remarks,
      department,
      miscIndex,
    };

    return (
      <tr key={task.key}>
        {/* remove by darrel className={`${hasDone && "table-active"}`} */}
        <td className="fw-bold">
          {capitalize(department)}{" "}
          {hasDone && (
            <MDBBadge color="success" className="ml-2">
              Done
            </MDBBadge>
          )}
        </td>
        <td>
          {capitalize(form)}{" "}
          {hasDone && <MDBIcon icon="check" className="ml-1" />}
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

          {hasDone && <MDBIcon icon="check" className="ml-1" />}
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
              color={hasDone ? "info" : "primary"}
              size="sm"
              className="py-1 px-3 m-0"
            >
              <MDBIcon icon={hasDone ? "pencil-alt" : "list-alt"} />
            </MDBBtn>
            {!!signatories.length &&
              signatories[0] &&
              signatories[1] &&
              hasDone && (
                <MDBBtn
                  rounded
                  onClick={() => {
                    const _task = {
                      ...task,
                      branchId: activePlatform?.branch,
                      referral: physicianId || {},
                      services: _packages,
                      signatories,
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
    forms,
    diagnostics = [],
  } = menu;

  console.log("forms:", forms);

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
              console.log("diagnostic :", diagnostic);
              // console.log("results :", results);
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

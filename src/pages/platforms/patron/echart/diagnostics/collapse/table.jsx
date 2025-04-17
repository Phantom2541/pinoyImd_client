import React, { useState } from "react";
import { capitalize } from "../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

export default function CollapseTable({ menu }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    [task, setTask] = useState({}),
    [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handlePrint = (task) => {
    const services = Services.whereIn(task.services).map(({ id, ...rest }) => {
      const range = collections.filter(({ serviceId }) => serviceId === id);
      return {
        ...rest,
        id,
        range,
      };
    });

    localStorage.setItem("taskPrintout", JSON.stringify({ ...task, services }));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  const { customerId, physicianId, source, category, _id, forms, results } =
    menu;

  const handleIndividual = (form, obj, index, miscIndex = 0) => {
    const { packages, hasDone = false, remarks = "", signatories = [] } = obj,
      { department } = Templates.collections.find(({ components }) =>
        components.includes(form)
      );

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
          {form} {hasDone && <MDBIcon icon="check" className="ml-1" />}
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
                  onClick={() =>
                    handlePrint({
                      ...task,
                      branchId: activePlatform?.branch,
                      referral: physicianId || {},
                      services: _packages,
                      signatories,
                      isPrint: true,
                    })
                  }
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
          {forms?.map((form, index) => {
            const result = results?.[form.toLowerCase()];
            if (!result)
              return (
                <tr key={task.key}>
                  <td colSpan={4}>Empty Test</td>
                </tr>
              );

            if (Array.isArray(result))
              return result.map((obj, i) =>
                handleIndividual(form, obj, index + i, i)
              );

            return handleIndividual(form, result, index);
          })}
        </tbody>
      </MDBTable>
    </>
  );
}

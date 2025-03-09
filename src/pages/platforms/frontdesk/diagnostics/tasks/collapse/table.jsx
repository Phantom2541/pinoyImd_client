import React, { useState, useEffect } from "react";
import { capitalize } from "../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import Modal from "./modal";
import { useSelector } from "react-redux";

export default function CollapseTable({ menu }) {
  const [labTests, setLabTests] = useState([]),
    [task, setTask] = useState({}),
    [showModal, setShowModal] = useState(false),
    { collections } = useSelector(({ preferences }) => preferences),
    { activePlatform } = useSelector(({ auth }) => auth);

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    const labTests = Templates.collections.reduce(
      (accumulator, { components, department }) => {
        if (department === "LAB") {
          const filteredComponents = components.filter(
            (component) => menu[component.toLowerCase()]
          );

          return [...accumulator, ...filteredComponents];
        }

        return accumulator;
      },
      []
    );

    setLabTests(labTests);
  }, [menu]);

  const handlePrint = (labTest) => {
    localStorage.setItem("taskPrintout", JSON.stringify(labTest));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px" // size of the page that will open
    );
  };

  const { customerId, physicianId, source, category, _id } = menu;

  const handleIndividual = (form, obj, index, miscIndex = 0) => {
    const { packages, hasDone = false, remarks = "", signatories = [] } = obj;

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
      <tr key={task.key} className={`${hasDone && "table-active"}`}>
        <td className="fw-bold">{capitalize(department)}</td>
        <td>{form}</td>
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
        </td>
        <td>
          <MDBBtnGroup>
            <MDBBtn
              onClick={() => {
                setTask(task);
                toggleModal();
              }}
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
                      referral: physicianId || {},
                      services: Services.whereIn(_packages),
                      preferences: collections,
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

  return (
    <>
      <MDBTable small hover responsive>
        <thead>
          <tr>
            <th>Department</th>
            <th>Template</th>
            <th>Services</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {labTests?.map((_labTest, index) => {
            const labTest = menu[_labTest.toLowerCase()];

            if (!labTest)
              return (
                <tr key={`empty-${index}`}>
                  <td colSpan={4}>Empty Test</td>
                </tr>
              );

            if (Array.isArray(labTest))
              return labTest.map((obj, i) =>
                handleIndividual(_labTest, obj, index + i, i)
              );

            return handleIndividual(_labTest, labTest, index);
          })}
        </tbody>
      </MDBTable>
      <Modal
        show={showModal}
        toggle={toggleModal}
        task={task}
        setTask={setTask}
      />
    </>
  );
}

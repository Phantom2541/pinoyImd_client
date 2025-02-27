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
    setLabTests(
      Templates.reduce((accumulator, { components, department }) => {
        if (department === "LAB") {
          return [
            ...accumulator,
            ...components.filter((component) => menu[component.toLowerCase()]),
          ];
        }
        // const labTests = Templates.reduce(
        //   (accumulator, { components, department }) => {
        //     if (department === "LAB") {
        //       const filteredComponents = components.filter(
        //         (component) => menu[component.toLowerCase()]
        //       );

        //       return [...accumulator, ...filteredComponents];
        //     }

        //     return accumulator;
      }, [])
    );
  }, [menu]);

  const handlePrint = (labTest) => {
    // console.log("reports",labTest);
    // console.log("activePlatform",activePlatform);

    localStorage.setItem("taskPrintout", JSON.stringify(labTest));
    window.open(
      "/printout/task",
      "Task Printout",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  const { customerId, physicianId, source, category, _id } = menu;

  const handleIndividual = (form, obj, index, miscIndex = 0) => {
    const { packages, hasDone = false, remarks = "", signatories = [] } = obj,
      { department } = Templates.find(({ components }) =>
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
              title="Modal"
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
                      signatories,
                      preferences: collections,
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
                <tr key={task.key}>
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

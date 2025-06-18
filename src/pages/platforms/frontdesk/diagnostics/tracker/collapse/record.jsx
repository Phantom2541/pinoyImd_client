import React, { useState } from "react";
import { capitalize } from "../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../modal";
import { SetTASK } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function CollapseTable({ menu }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    [showModal, setShowModal] = useState(false),
    dispatch = useDispatch();

  const toggleModal = () => setShowModal(!showModal);

  const handleLabPrint = (task) => {
    const services = collections.filter(({ id }) => task.services.includes(id));
    localStorage.setItem("taskPrintout", JSON.stringify({ ...task, services }));

    const URL = `${window.location.origin}/printout/laboratory/task`;
    const title = `Laboratory Task Printout`;
    const features = "top=100px,left=100px,width=794px,height=1123px";

    setTimeout(() => {
      const printWindow = window.open(URL, title, features);
      if (printWindow) {
        printWindow.focus();
      } else {
        console.warn("Popup blocked or failed to open.");
      }
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

  const handleIndividual = (form, obj = {}, index, miscIndex = 0) => {
    console.log("obj", obj);

    const { department } = Templates.findByComponentName(form);

    const _packages = Array.isArray(obj?.packages)
      ? obj.packages
      : Object.keys(obj?.packages || {}).map(Number);
    console.log("_packages", _packages);

    const task = {
      ...obj,
      key: `${form}-${index}`,
      form,
      generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
      patient: customerId,
      source: source || {},
      hasDone: obj?.hasDone,
      category,
      _id: _id,
      remarks: obj?.remarks,
      department,
      miscIndex,
      packages: obj?.packages,
    };

    return (
      <tr key={task.key}>
        <td className="fw-bold">
          {capitalize(department)}
          {obj?.hasDone && (
            <MDBBadge color="success" className="ml-2">
              Done
            </MDBBadge>
          )}
        </td>
        <td>{capitalize(form)}</td>
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
            {menu?.branchId === activePlatform.branchId && (
              <MDBBtn
                title="Modal"
                rounded
                onClick={() => {
                  console.log("onClick-menu", menu);
                  console.log("onClick-task", task);

                  dispatch(SetTASK({ task }));
                }}
                color={obj?.hasDone ? "info" : "primary"}
                size="sm"
                className="py-1 px-3 m-0"
              >
                <MDBIcon icon={obj?.hasDone ? "pencil-alt" : "list-alt"} />
              </MDBBtn>
            )}
            {Array.isArray(obj?.signatories) &&
              obj.signatories.length >= 2 &&
              obj?.signatories[0] &&
              obj?.signatories[1] &&
              obj?.hasDone && (
                <MDBBtn
                  rounded
                  onClick={() => {
                    const selected = {
                      ...task,
                      branchId: menu?.branchId,
                      referral: physicianId || {},
                      services: _packages,
                      signatories: obj?.signatories,
                      isPrint: true,
                    };
                    activePlatform.department === "Laboratory"
                      ? handleLabPrint(selected)
                      : handleRadPrint(selected);
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

  const { customerId, physicianId, source, category, _id, diagnostic } = menu;
  console.log("diagnostic", diagnostic);

  return (
    <>
      <MDBTable small hover responsive bordered className="w-100">
        <thead>
          <tr>
            <th>Department</th>
            <th>Template</th>
            <th>Services</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {diagnostic &&
            Object.keys(diagnostic)?.map((key, index) => {
              const rawEntry = diagnostic[key];
              const entry = { ...rawEntry, key }; // ✅ avoid modifying frozen object
              console.log("rawEntry", rawEntry);
              console.log("entry", entry);

              if (Array.isArray(entry.packages)) {
                return entry.packages.map((obj, i) =>
                  handleIndividual(key, entry, index + i, i)
                );
              }

              return handleIndividual(key.toLowerCase(), entry, index);
            })}
        </tbody>
      </MDBTable>

      <Modal show={showModal} toggle={toggleModal} task={menu} />
    </>
  );
}

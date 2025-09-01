import { capitalize } from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

const radiology = ["ecg", "xray", "2decho", "utz", "fibroscan", "ctscan"];

export default function CollapseTable({ menu }) {
  const { collections } = useSelector(({ preferences }) => preferences);
  const department = menu?.department[0];

  const handleLabPrint = (task) => {
    const _task = {
      ...task,
      signatories: Array.isArray(task?.signatories)
        ? task.signatories.map((s, i) => ({
            ...s,
            withSignature: (i === 0 || i === 1) && true,
          }))
        : undefined,
    };

    const services = collections.filter(({ id }) => task.services.includes(id));
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services, isDuplicate: true })
    );

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
    const _task = {
      ...task,
      signatories: Array.isArray(task?.signatories)
        ? task.signatories.map((s, i) => ({
            ...s,
            withSignature: (i === 0 || i === 1) && true,
          }))
        : undefined,
    };
    const services = Services.find(task.services);
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services, isDuplicate: true })
    );
    window.open(
      "/printout/radiology/task",
      "Radiology Task Printout",
      "top=100px,left=100px,width=794px,height=1123px"
    );
  };

  const handleIndividual = (
    form,
    obj = {},
    index,
    miscIndex = null,
    multipleTask = false //example if the sections is miscellenious and the task of mis
  ) => {
    const { packages } = obj;
    const _packages = Array.isArray(packages)
      ? packages
      : typeof packages === "object"
      ? Object.keys(obj?.packages || {}).map(Number)
      : [packages];

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
      },
      rad = radiology.includes(form);
    return (
      <tr key={`${task.key}-${index}`}>
        <td>
          {index + 1}{" "}
          {typeof miscIndex === "number" && multipleTask
            ? `-${miscIndex + 1}`
            : ""}
          . <strong>{capitalize(rad ? "Radiology" : "Laboratory")}</strong>
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
            {Array.isArray(obj?.signatories) &&
            obj?.signatories?.length >= 2 &&
            obj?.hasDone ? (
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
                  !rad ? handleLabPrint(selected) : handleRadPrint(selected);
                }}
                color="warning"
                size="sm"
                className="py-1 px-3 m-0"
              >
                <MDBIcon icon="print" />
              </MDBBtn>
            ) : (
              <span className="text-primary fw-bold"> In progress</span>
            )}
          </MDBBtnGroup>
        </td>
      </tr>
    );
  };

  const { customerId, physicianId, source, category, _id, diagnostic } = menu;
  return (
    <>
      <MDBTable small hover responsive bordered className="w-100">
        <thead>
          <tr>
            <th>Department</th>
            <th>Section</th>
            <th>Services</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {diagnostic ? (
            Object.keys(diagnostic)?.map((key, index) => {
              const rawEntry = diagnostic[key];
              const entry = { ...rawEntry, key };
              if (Array.isArray(rawEntry))
                return rawEntry.map((result, i) =>
                  handleIndividual(
                    key.toLowerCase(),
                    result,
                    index,
                    i,
                    rawEntry.length > 1
                  )
                );
              return handleIndividual(key.toLowerCase(), entry, index);
            })
          ) : (
            <tr>
              <td colSpan={4} className="font-weight-bold text-center">
                Go to the {department === "LAB" ? "laboratory" : "radiology"}
              </td>
            </tr>
          )}
        </tbody>
      </MDBTable>
    </>
  );
}

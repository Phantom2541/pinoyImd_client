import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBCardBody, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { Services } from "../../../../../services/fakeDb";
import {
  SetTASK,
  SetSELECTED,
} from "../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function BodyTemplate() {
  const {
    filteredStatus,
    byGroup: selectedKey,
    activePage,
    maxPage,
  } = useSelector(({ validator }) => validator);
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filteredStatus.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleLabPrint = (task) => {
    console.log("task", task);
    const services = collections.filter(({ id }) => task.services.includes(id));
    const taskData = { ...task, services };

    // Store data in localStorage
    localStorage.setItem("taskPrintout", JSON.stringify(taskData));

    // Construct the URL
    const URL = `${window.location.origin}/printout/laboratory/task`;
    const title = `Laboratory Task Printout`;
    const features = "top=100px,left=100px,width=794px,height=1123px";

    setTimeout(() => {
      const printWindow = window.open(URL, title, features);

      if (printWindow) {
        console.log("Print window opened successfully.");
        console.log("Print window location:", printWindow.location.href);
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

  console.log("activePlatform", activePlatform);

  const handleEntry = (task, deal) => {
    dispatch(SetSELECTED({ deal }));
    dispatch(SetTASK({ task }));
  };

  return (
    <MDBCardBody>
      <MDBTable responsive hover small>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Services</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((deal, index) => {
            const { _id, customerId, diagnostic } = deal;
            const { signatories, hasDone, packages, remarks } =
              deal?.diagnostic[selectedKey];

            console.log("form", diagnostic[selectedKey]);

            const _task = {
              ...diagnostic[selectedKey],
              key: `${index}-${selectedKey}`,
              form: selectedKey,
              patient: customerId,
              generateHealthyClient: [
                "Urinalysis",
                "Parasitology",
                "Xray",
                "Ultrasound",
              ].includes(selectedKey)
                ? true
                : false,
              hasDone,
              remarks,
            };

            // Collect all actual service names (e.g., fbs, crea, uric)
            const serviceList = (() => {
              const selectedDiagnostic = diagnostic?.[selectedKey];
              if (!selectedDiagnostic || !selectedDiagnostic.packages)
                return "No Services";

              // Lookup map from fake DB
              const packageNameMap = Object.fromEntries(
                Services.collections.map((pkg) => [
                  String(pkg.id),
                  pkg.abbreviation,
                ])
              );

              const packages = selectedDiagnostic.packages;

              // If packages is an array of IDs
              if (Array.isArray(packages)) {
                return (
                  packages
                    .map(
                      (id) => packageNameMap[String(id)] || `Unknown (${id})`
                    )
                    .join(", ") || "No Services"
                );
              }

              // If packages is an object with keys as IDs
              if (typeof packages === "object") {
                return (
                  Object.keys(packages)
                    .map((key) => packageNameMap[key] || `Unknown (${key})`)
                    .join(", ") || "No Services"
                );
              }

              return "No Services";
            })();

            return (
              <tr key={_id}>
                <td>{startIndex + index + 1}</td>
                <td>{fullName(customerId?.fullName) || "Unnamed Patient"}</td>
                <td>{serviceList}</td>
                <td>
                  <MDBBtnGroup>
                    <MDBBtn
                      onClick={() => handleEntry(_task, deal)}
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
                          onClick={() => {
                            const selected = {
                              ..._task,
                              branchId: activePlatform?.branch,
                              services: packages,
                              signatories,
                              isPrint: true,
                            };
                            activePlatform?.department === "Laboratory"
                              ? handleLabPrint(selected)
                              : handleRadPrint(selected);
                          }}
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
          })}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
}

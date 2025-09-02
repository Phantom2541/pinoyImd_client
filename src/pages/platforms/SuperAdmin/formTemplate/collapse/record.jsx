import { capitalize } from "../../../../../services/utilities";
import { Services, Templates } from "../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../laboratory/diagnostics/tasks/modal";
import { SetTASK } from "../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function CollapseTable({ menu }) {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ preferences }) => preferences);
  const dispatch = useDispatch();
  const department = menu?.department?.[0];

  const handleLabPrint = (task) => {
    const _task = {
      ...task,
      signatories: Array.isArray(task?.signatories)
        ? task.signatories.map((s, i) => ({ ...s, withSignature: i < 2 }))
        : undefined,
    };

    const services = collections.filter(({ id }) => task.services.includes(id));
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services })
    );

    const URL = `${window.location.origin}/printout/laboratory/task`;
    const features = "top=100px,left=100px,width=794px,height=1123px";

    setTimeout(() => {
      const printWindow = window.open(
        URL,
        "Laboratory Task Printout",
        features
      );
      printWindow?.focus();
    }, 100);
  };

  const handleRadPrint = (task) => {
    const _task = {
      ...task,
      signatories: Array.isArray(task?.signatories)
        ? task.signatories.map((s, i) => ({ ...s, withSignature: i < 2 }))
        : undefined,
    };

    const services = Services.find(task.services) || [];
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services })
    );

    window.open(
      "/printout/radiology/task",
      "Radiology Task Printout",
      "top=100px,left=100px,width=794px,height=1123px"
    );
  };

  const handleIndividual = (form, obj = {}, index, miscIndex = 0) => {
    const departmentName = Templates.findByComponentName(form)?.department;

    // ✅ Safe _packages handling
    const _packages = Array.isArray(obj?.packages)
      ? obj.packages
      : obj?.packages
      ? [obj.packages]
      : [];

    const task = {
      ...obj,
      key: `${form}-${index}-${miscIndex}`,
      form,
      generateHealthyClient: ["Urinalysis", "Parasitology"].includes(form),
      patient: menu?.customerId,
      source: menu?.source || {},
      hasDone: obj?.hasDone,
      category: menu?.category,
      _id: menu?._id,
      remarks: obj?.remarks,
      department: departmentName,
      miscIndex,
      packages: obj?.packages,
    };

    const handleModal = () => {
      dispatch(SetTASK({ task }));
    };

    return (
      <tr key={task.key}>
        <td className="fw-bold">
          {capitalize(departmentName)}
          {obj?.hasDone && (
            <MDBBadge color="success" className="ml-2">
              Done
            </MDBBadge>
          )}
        </td>
        <td>{capitalize(form)}</td>
        <td>
          {_packages.length === 0 ? (
            <MDBBadge color="danger" pill>
              No services
            </MDBBadge>
          ) : (
            Services.whereIn(_packages)?.map(({ abbreviation }, idx) => (
              <MDBBadge
                key={`${task.key}-service-${idx}`}
                pill
                className="pt-1"
              >
                {abbreviation}
              </MDBBadge>
            ))
          )}
        </td>
        <td>
          <MDBBtnGroup>
            <MDBBtn
              title="Modal"
              rounded
              onClick={handleModal}
              color={obj?.hasDone ? "info" : "primary"}
              size="sm"
              className="py-1 px-3 m-0"
            >
              <MDBIcon icon={obj?.hasDone ? "pencil-alt" : "list-alt"} />
            </MDBBtn>

            {Array.isArray(obj?.signatories) &&
              obj.signatories.length >= 2 &&
              obj?.hasDone && (
                <MDBBtn
                  rounded
                  onClick={() => {
                    const selected = {
                      ...task,
                      branchId: menu?.branchId,
                      referral:
                        menu?.physicianId?.fullName?.lname ||
                        menu?.physicianSTR ||
                        "",
                      services: _packages,
                      signatories: obj?.signatories,
                      isPrint: true,
                    };
                    activePlatform?.department === "Laboratory"
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

  const diagnostic = menu?.diagnostic;

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
            Object.keys(diagnostic).map((key, index) => {
              const rawEntry = diagnostic[key];
              if (Array.isArray(rawEntry))
                return rawEntry.map((result, i) =>
                  handleIndividual(key.toLowerCase(), result, index, i)
                );
              return handleIndividual(
                key.toLowerCase(),
                { ...rawEntry, key },
                index
              );
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
      <Modal />
    </>
  );
}

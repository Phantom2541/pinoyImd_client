import { capitalize } from "../../../../../../../services/utilities";
import { Services, Templates } from "../../../../../../../services/fakeDb";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { useSelector } from "react-redux";

export default function CollapseTable({ menu }) {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ preferences }) => preferences),
    // [showModal, setShowModal] = useState(false),
    department = menu?.department[0];

  // const toggleModal = () => setShowModal(!showModal);
  const { customerId, source, category, _id, diagnostic } = menu;

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
    _task.patient = customerId;
    console.log("_task", _task);

    const services = collections.filter(({ id }) => task.services.includes(id));
    localStorage.setItem(
      "taskPrintout",
      JSON.stringify({ ..._task, services })
    );
  };

  // const handleIndividual = (form, obj = {}, index, miscIndex = 0) => {
  //   const department = Templates.findByComponentName(form)?.department;

  //   const _packages = Array.isArray(obj?.packages)
  //     ? obj.packages
  //     : Object.keys(obj?.packages || {}).map(Number);

  //   const task = {
  //     ...obj,
  //     key: `${form}-${index}`,
  //     form,
  //     generateHealthyClient: form === "Urinalysis" || form === "Parasitology",
  //     patient: customerId,
  //     source: source || {},
  //     hasDone: obj?.hasDone,
  //     category,
  //     _id: _id,
  //     remarks: obj?.remarks,
  //     department,
  //     miscIndex,
  //     packages: obj?.packages,
  //   };

  // const handleModal = () => {
  //   task.customerId = task.patient;
  //   dispatch(SetTASK({ task }));
  // };

  // return <span>{form}</span>;
  // };

  console.log("customerId", customerId);

  return (
    <>
      {diagnostic ? (
        Object.keys(diagnostic)?.map((key, index) => {
          const rawEntry = diagnostic[key];
          const entry = { ...rawEntry, key };
          if (Array.isArray(rawEntry))
            return rawEntry.map((result, i) =>
              console.log(
                "key",
                key.toLowerCase(),
                "result",
                result,
                "index",
                index,
                "i",
                i,
                "rawEntry",
                rawEntry.length > 1
              )
            );
          console.log("entry", entry);

          // return handleIndividual(key.toLowerCase(), entry, index);
          return (
            <div className="checkup-data-tracker-item-container">
              <span
                className="checkup-data-tracker-item"
                onClick={() => handleLabPrint(entry)}
              >
                {key}
              </span>
            </div>
          );
        })
      ) : (
        <tr>
          <td colSpan={4} className="font-weight-bold text-center">
            Go to the {department === "LAB" ? "laboratory" : "radiology"}
          </td>
        </tr>
      )}
    </>
  );
}

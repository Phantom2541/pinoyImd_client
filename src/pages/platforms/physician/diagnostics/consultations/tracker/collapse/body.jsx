import { MDBCardBody } from "mdbreact";
import Record from "./record";
import { useSelector } from "react-redux";

export default function TaskBody({ task }) {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const {
    diagnostic = {},
    _id,
    category,
    source,
    physicianId,
    physicianSTR,
    branchId: branch,
    customerId: customer,
  } = task;
  const referral = physicianId?.fullName?.lname || physicianSTR || "";

  return (
    <MDBCardBody className=" w-100 m-0 p-0">
      {Object.entries(diagnostic || {})?.map(([key, task], index) => {
        const isEmpty = !task || (Array.isArray(task) && task.length === 0);
        const _task = { ...task, category, source, referral, _id };
        if (isEmpty && activePlatform.department === "Laboratory") {
          return (
            <tr key={`empty-${index}`}>
              <td colSpan={4}>Empty Test</td>
            </tr>
          );
        }

        if (
          ["miscellaneous", "xray", "ultrasound"].includes(key.toLowerCase())
        ) {
          return task.map((t, i) => {
            const _t = { ...t, category, source, referral, dealId: _id };
            return (
              <Record
                key={`subform-${i}`}
                form={key}
                branch={branch}
                obj={_t || {}}
                customer={customer}
                index={`${index + 1}-${i + 1}`}
              />
            );
          });
        }
        return (
          <Record
            key={`form-${index}`}
            form={key}
            branch={branch}
            obj={_task || {}}
            customer={customer}
            index={index + 1}
          />
        );
      })}
    </MDBCardBody>
  );
}

import { MDBCardBody } from "mdbreact";
import Record from "./record";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function TaskBody({ task, isActive }) {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [activeSection, setActiveSection] = useState("");
  const { activeDiag = {} } = appointment || {};
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

  useEffect(() => {
    if (!activeDiag?.isImg && activeDiag?.dealId) {
      setActiveSection(activeDiag?.section);
    }
  }, [activeDiag]);
  return (
    <MDBCardBody className=" w-100 m-0 p-0" key={_id}>
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
                _key={`subform-${i}`}
                form={key}
                isSelected={activeSection === key && i === 0 && isActive}
                setActiveSection={setActiveSection}
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
            _key={`form-${index}`}
            form={key}
            branch={branch}
            isSelected={activeSection === key && isActive}
            setActiveSection={setActiveSection}
            obj={_task || {}}
            customer={customer}
            index={index + 1}
          />
        );
      })}
    </MDBCardBody>
  );
}

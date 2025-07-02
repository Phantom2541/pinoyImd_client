import { MDBTable, MDBCardBody } from "mdbreact";
import Record from "./record";
import { useSelector } from "react-redux";

export default function Body({
  _id,
  customer,
  tasks,
  category,
  source,
  referral,
}) {
  const { activePlatform } = useSelector(({ auth }) => auth);
  return (
    <MDBCardBody className="pt-0">
      <MDBTable small hover responsive>
        <thead>
          <tr>
            <th>Performer</th>
            <th>Template</th>
            <th>Services</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tasks || {})?.map(([key, task], index) => {
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
              ["miscellaneous", "xray", "ultrasound"].includes(
                key.toLowerCase()
              )
            ) {
              return task.map((t, i) => {
                const _t = { ...t, category, source, referral, dealId: _id };
                return (
                  <Record
                    key={`subform-${i}`}
                    form={key}
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
                obj={_task || {}}
                customer={customer}
                index={index + 1}
              />
            );
          })}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
}

import React from "react";
import { MDBTable, MDBCardBody } from "mdbreact";
import Task from "./task";
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
            const _task = { ...task, category, source, referral };
            if (isEmpty && activePlatform.department === "laboratory") {
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
                const _t = { ...t, category, source, referral };
                return (
                  <Task
                    _id={t._id}
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
              <Task
                _id={_id}
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

import React from "react";
import { MDBTable, MDBCardBody } from "mdbreact";
import Task from "./task";
import { useSelector } from "react-redux";

export default function Body({ _id, customer, tasks }) {
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

            if (isEmpty && activePlatform.department === "laboratory") {
              return (
                <tr key={`empty-${index}`}>
                  <td colSpan={4}>Empty Test</td>
                </tr>
              );
            }

            if (["misclaneous", "xray"].includes(key.toLowerCase())) {
              return task.map((t, i) => (
                <Task
                  _id={t._id}
                  key={`form-${i}`}
                  form={key}
                  obj={t || {}}
                  customer={customer}
                  index={`${index + 1}-${i + 1}`}
                />
              ));
            }

            return (
              <Task
                _id={_id}
                key={`form-${index}`}
                form={key}
                obj={task || {}}
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

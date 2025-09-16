import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { dateFormat } from "../../../../../../../../services/utilities";
import React from "react";
import Result from "./result";

const Results = () => {
  const { collections: results } = useSelector(({ validator }) => validator);

  return (
    <MDBTable small bordered>
      <thead>
        <tr>
          <th>Department</th>
          <th>Section</th>
          <th>Services</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, index) => {
          const { diagnostic = {}, _id } = item;
          return (
            <React.Fragment key={index}>
              <tr>
                <td colSpan={4} className="bg-light fw-bold">
                  {dateFormat(item?.createdAt)}
                </td>
              </tr>
              {Object.entries(diagnostic || {})?.map(([key, task], index) => {
                const isEmpty =
                  !task || (Array.isArray(task) && task.length === 0);
                const _task = { ...task, _id };
                if (isEmpty) {
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
                    const _t = {
                      ...t,
                      dealId: _id,
                    };
                    return (
                      <Result
                        form={key}
                        obj={_t || {}}
                        index={`${index + 1}-${i + 1}`}
                      />
                    );
                  });
                }
                return (
                  <Result form={key} obj={_task || {}} index={index + 1} />
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Results;

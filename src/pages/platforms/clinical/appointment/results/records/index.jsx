import { MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Result from "./result";
import { TRACKER } from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { dateFormat } from "../../../../../../services/utilities";
const Records = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections: results } = useSelector(({ validator }) => validator),
    { selected, showResultModal: show } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

  const { patient = {} } = selected || {};
  useEffect(() => {
    if (show && patient?._id) {
      dispatch(
        TRACKER({
          token,
          key: {
            customerId: patient?._id,
            department: "Laboratory",
            limit: 10,
          },
        })
      );
    }
  }, [dispatch, token, patient, show]);

  return (
    <div>
      <span style={{ fontWeight: 500 }} className="mb-2 d-block">
        Record of patient in database
      </span>
      <div style={{ maxHeight: "30rem", overflowY: "auto" }}>
        <MDBTable small bordered>
          <thead
            style={{
              position: "sticky",
              top: "-1px", // distance from top of scroll container
              zIndex: 10, // keep it above rows
              background: "#ffffff", // solid bg so rows don't show through
            }}
          >
            <tr>
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
                  {Object.entries(diagnostic || {})?.map(
                    ([key, task], index) => {
                      const isEmpty =
                        !task || (Array.isArray(task) && task.length === 0);
                      const _task = { ...task, dealId: _id };
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
                        <Result
                          form={key}
                          obj={_task || {}}
                          index={index + 1}
                        />
                      );
                    }
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </MDBTable>
      </div>
    </div>
  );
};

export default Records;

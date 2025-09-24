import { MDBCard, MDBCardBody, MDBCol, MDBTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Result from "./result";
import {
  TRACKER,
  SetCOLLECTIONS,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { dateFormat } from "../../../../../../services/utilities";
import TableLoading from "../../../../../../components/tableLoading";
const Records = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections: results, isLoading } = useSelector(
      ({ validator }) => validator
    ),
    {
      selected,
      showResultModal: show,
      diagnostic = {},
    } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();

  const { department = "", patient = {} } = selected || {};

  useEffect(() => {
    if (show && patient?._id) {
      const lcStorage = localStorage.getItem(
        `appointment-${selected._id}-${department}`
      );
      if (lcStorage) {
        dispatch(SetCOLLECTIONS(JSON.parse(lcStorage)));
      } else {
        dispatch(
          TRACKER({
            token,
            key: {
              customerId: patient?._id,
              department: department === "lab" ? "Laboratory" : "Radiology",
              isClinic: true,
              limit: 10,
            },
          })
        ).then((action) => {
          const { payload = [] } = action?.payload || {};
          localStorage.setItem(
            `appointment-${selected._id}-${department}`,
            JSON.stringify(payload)
          );
        });
      }
    }
    return () => dispatch(RESET());
  }, [dispatch, token, patient, show, department, selected]);

  if (isLoading) {
    return (
      <MDBCol>
        <MDBCard className="shadow-sm border-0 rounded-3">
          <MDBCardBody style={{ minHeight: "30rem" }}>
            <span style={{ fontWeight: 500 }} className="mb-2 d-block">
              Record of patient in database
            </span>
            <TableLoading />;
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    );
  }

  if (!isLoading && results?.length === 0) {
    return null;
  }

  const chosenCount = Object.entries(diagnostic)
    .filter(([key]) => key.toLowerCase() !== "images") // tanggalin yung "images"
    .reduce((sum, [, value]) => {
      if (Array.isArray(value)) {
        return sum + value.length; // bilangin kung array
      }
      return sum + 1; // kung object o ibang type, bilangin as 1
    }, 0);

  return (
    <MDBCol>
      <MDBCard className="shadow-sm border-0 rounded-3">
        <MDBCardBody>
          <div>
            <div className="d-flex justify-content-between">
              <span style={{ fontWeight: 500 }} className="mb-2 d-block">
                Record of patient in database
              </span>
              <div>
                <span>
                  {chosenCount > 0 && `Chosen Section: (${chosenCount})`}
                </span>
              </div>
            </div>
            <div style={{ maxHeight: "25.8rem", overflowY: "auto" }}>
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
                              !task ||
                              (Array.isArray(task) && task.length === 0);
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
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default Records;

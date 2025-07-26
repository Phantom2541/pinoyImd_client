import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Indicator from "./indicator";
import { Input } from "../../../../../../components/customizable";
import {
  SetSelected,
  UPDATE,
  SAVE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/management/temperatures";
const Card = ({ txt, num, index }) => {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { collections, selected, isSuccess, formSubmitted } = useSelector(
      ({ temperatures }) => temperatures
    ),
    dispatch = useDispatch();

  /**
   * default value for style
   */
  const today = new Date();
  const dateCell = new Date(txt);
  const isFuture = dateCell > today;
  const week = txt?.slice(0, 3);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
      dispatch(SetSelected({})); // ✅ close the editor
    }
  }, [formSubmitted, isSuccess, dispatch]);
  const entry = collections?.find(
    (entry) =>
      new Date(entry?.createdAt).toDateString() === dateCell.toDateString()
  );

  const setSelected = (payload) => dispatch(SetSelected(payload));
  const isSelected = (type) => selected.id === index && selected.type === type;

  const handleCheck = ({ value: _temp }) => {
    const temp = Number(_temp);
    const { meridiem, type } = selected;
    const dateWith9AM = new Date(dateCell);
    dateWith9AM.setHours(9, 0, 0, 0);

    if (temp) {
      dispatch(
        entry
          ? UPDATE({
              data: {
                _id: entry._id,
                [meridiem]: {
                  ...entry?.[meridiem],
                  [type]: temp,
                },
              },
              token,
            })
          : SAVE({
              data: {
                branchId: activePlatform?.branchId,
                userId: auth._id,
                createdAt: dateWith9AM.toISOString(),
                [meridiem]: { [type]: temp },
              },
              token,
            })
      );
    }
  };

  const handleLabel = () => {
    const { type, meridiem } = selected;
    if (type === "room") return `Room ${meridiem}`;
    return `Fridge ${meridiem}`;
  };
  return (
    <div className="position-relative">
      <div
        className={`temperature-calendar-card ${
          num ? "" : "opacity-0 pointer-events-none"
        }`}
        key={`pos-calendar-${index}`}
      >
        <Indicator num={num} week={week} isFuture={isFuture} />
        <div className="sales-card-body h-100  d-flex  justify-content-center align-items-center position-relative">
          <div className="sales-card-info " style={{ width: "100%" }}>
            {!isFuture && (
              <div className={"mt-4 "}>
                <table className="table table-sm table-bordered w-100  ">
                  <thead className="thead-light">
                    <tr>
                      <th
                        className="text-center"
                        scope="col"
                        style={{
                          fontSize: "0.7rem",
                        }}
                      >
                        Meridiem
                      </th>
                      <th
                        className="text-center"
                        scope="col"
                        style={{
                          color: isSelected("room") && "blue",
                        }}
                      >
                        Room
                      </th>
                      <th
                        scope="col"
                        className="text-center"
                        style={{
                          color: isSelected("ref") && "blue",
                        }}
                      >
                        Fridge
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      {selected.id === index && selected.meridiem === "AM" ? (
                        <td colSpan={3} className="position-relative">
                          <div
                            style={{
                              marginTop: "-7.6px",
                              marginBottom: "-7.6px",
                            }}
                          >
                            <Input
                              label={handleLabel()}
                              onChange={(key, value) =>
                                setSelected({ ...selected, [key]: value })
                              }
                              formSubmitted={formSubmitted}
                              isSuccess={isSuccess}
                              type="number"
                              className="form-control form-control-sm "
                              selected={selected}
                              _key={"value"}
                              handleCheck={(value) => handleCheck(value)}
                              handleClose={() => setSelected({})}
                            />
                          </div>
                        </td>
                      ) : (
                        <>
                          <td>AM</td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                id: index,
                                meridiem: "AM",
                                type: "room",
                                value: entry?.AM?.room,
                              })
                            }
                          >
                            {entry?.AM?.room || "-"}
                          </td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                id: index,
                                meridiem: "AM",
                                type: "ref",
                                value: entry?.AM?.ref,
                              })
                            }
                          >
                            {entry?.AM?.ref || "-"}
                          </td>
                        </>
                      )}
                    </tr>
                    <tr className="text-center">
                      {selected.id === index && selected.meridiem === "PM" ? (
                        <td colSpan={3}>
                          <div
                            style={{
                              marginTop: "-7.6px",
                              marginBottom: "-7.6px",
                            }}
                          >
                            <Input
                              onChange={(key, value) =>
                                setSelected({ ...selected, [key]: value })
                              }
                              label={handleLabel()}
                              formSubmitted={formSubmitted}
                              isSuccess={isSuccess}
                              type="number"
                              className="form-control form-control-sm "
                              selected={selected}
                              _key={"value"}
                              handleCheck={(value) => handleCheck(value)}
                              handleClose={() => setSelected({})}
                            />
                          </div>
                        </td>
                      ) : (
                        <>
                          <td>PM</td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                id: index,
                                meridiem: "PM",
                                type: "room",
                                value: entry?.PM?.room,
                              })
                            }
                          >
                            {entry?.PM?.room || "-"}
                          </td>
                          <td
                            className="cursor-pointer"
                            onClick={() =>
                              setSelected({
                                id: index,
                                meridiem: "PM",
                                type: "ref",
                                value: entry?.PM?.ref,
                              })
                            }
                          >
                            {entry?.PM?.ref || "-"}
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* <Footer dateCell={dateCell} txt={txt} /> */}
      </div>
    </div>
  );
};

export default Card;

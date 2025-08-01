import { MDBCardBody } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { fullName } from "../../../../services/utilities";
import { Duty } from "../../../../services/fakeDb";
import Footer from "./footer";
import EditableSelect from "../../../../components/customizable/editableSelect";
import { UPDATE } from "../../../../services/redux/slices/finance/bookkeeping/duties";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { isFirstSched, month, year, selected, formSubmitted, isSuccess } =
      useSelector(({ duties }) => duties);
  const dispatch = useDispatch();
  const { breakdown = [] } = selected || {};
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const daysInSchedule = isFirstSched ? 15 : lastDayOfMonth - 15;
  const startDay = isFirstSched ? 1 : 16;
  const dayHeaders = Array.from(
    { length: daysInSchedule },
    (_, i) => startDay + i
  );
  const weekHeaders = Array.from({ length: daysInSchedule }, (_, i) => {
    const date = new Date(year, month - 1, startDay + i); // month is zero-based
    return date.toLocaleDateString("en-US", { weekday: "short" }); // 'Mon', 'Tue', etc.
  });

  const handleUpdate = (breakdownID, editedData, colIndex) => {
    const { value } = editedData;
    var employee = breakdown.find((item) => item._id === breakdownID);
    const sched = [...employee.sched];
    const ro = [...employee.ro];

    if (value === "RO") {
      sched[colIndex] = "";
      ro.push(colIndex + 1);
    } else {
      const roIndex = ro.indexOf(colIndex + 1);
      if (roIndex > -1) {
        ro.splice(roIndex, 1);
      }
      sched[colIndex] = value;
    }
    dispatch(
      UPDATE({
        token,
        data: { sched, ro, breakdownID, _id: selected._id },
        token,
      })
    );
  };

  return (
    <MDBCardBody>
      <table className="template-schedule-table">
        <thead>
          <tr>
            <th rowSpan="2">EMPLOYEE</th>
            {dayHeaders.map((day, index) => (
              <th key={index} className="text-center">
                {day}
              </th>
            ))}
          </tr>
          <tr>
            {weekHeaders.map((day, index) => (
              <th key={index} className="text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {breakdown.length > 0
            ? breakdown.map(({ eid, _id, sched }, rowIdx) => (
                <tr key={rowIdx}>
                  <td
                    style={{
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fullName(eid.fullName)}
                  </td>
                  {sched.map((val, colIdx) => {
                    const value = val ? val : "RO";
                    return (
                      <td
                        key={colIdx}
                        className={"position-relative duty-editable-select"}
                      >
                        {/* {val} */}
                        <EditableSelect
                          formSubmitted={formSubmitted}
                          isSuccess={isSuccess}
                          preValue={value}
                          isCapitalize={false}
                          collections={Duty.collections.map((item) => ({
                            text: item.code,
                            value: item.code,
                          }))}
                          parentClassName="d-flex align-items-center justify-content-center"
                          className="mb-n3 mt-n1"
                          classNameTxt={`template-schedule-${
                            val === "O" || !val ? "red" : ""
                          } `}
                          animation
                          animationStyle={{
                            width: "8rem",
                            top: "5px",
                            left: "0px",
                          }}
                          isEditable={true}
                          fieldData={{
                            _id: colIdx,
                            value: value,
                            text: value,
                          }}
                          keyForValue={"value"}
                          keyForText={"text"}
                          onSave={(data) => handleUpdate(_id, data, colIdx)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            : new Array(5).fill("").map((_, index) => (
                <tr key={index}>
                  <td style={{ height: "2.1rem" }}></td>
                  {new Array(daysInSchedule).fill("").map((_, index) => (
                    <td key={index}></td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      <Footer />
    </MDBCardBody>
  );
};

export default Body;

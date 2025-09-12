import { MDBCol } from "mdbreact";
import { EditableSelect } from "../../../../../../components/customizable";

const Time = ({
  label = "Start Time",
  baseKey = "start",
  schedule,
  setSchedule = () => {},
}) => {
  const period = schedule?.[baseKey]?.hour > 12 ? "PM" : "AM";
  return (
    <MDBCol>
      <span>{label}:</span>
      <div className="d-flex align items-center mt-4">
        <EditableSelect
          collections={[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((i) => ({
            text: i > 12 ? i - 12 : i,
            value: i,
          }))}
          keyForValue={"value"}
          keyForText={"text"}
          preValue={schedule?.[baseKey]?.hour}
          onChange={(e) =>
            setSchedule({
              ...schedule,
              [baseKey]: { ...schedule[baseKey], hour: Number(e) },
            })
          }
          label="Hours"
        />
        <EditableSelect
          collections={[
            { text: "00", value: 0 },
            ...(schedule?.[baseKey]?.hour !== 17
              ? [
                  { text: "15", value: 15 },
                  { text: "30", value: 30 },
                  { text: "45", value: 45 },
                ]
              : []),
          ]}
          preValue={schedule?.[baseKey]?.min}
          keyForValue={"value"}
          keyForText={"text"}
          onChange={(e) =>
            setSchedule({
              ...schedule,
              [baseKey]: { ...schedule[baseKey], min: Number(e) },
            })
          }
          label="Minutes"
          className="mx-4"
        />
        <EditableSelect
          collections={[period]}
          label="Period"
          preValue={period}
        />
      </div>
    </MDBCol>
  );
};

export default Time;

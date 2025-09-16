import { MDBBtn, MDBPopover, MDBPopoverBody, MDBTable } from "mdbreact";
import { useEffect, useState } from "react";
const days = [
  {
    value: "M",
    label: "Monday",
  },
  {
    value: "T",
    label: "Tuesday",
  },
  {
    value: "W",
    label: "Wednesday",
  },
  {
    value: "TH",
    label: "Thursday",
  },
  {
    value: "F",
    label: "Friday",
  },
  {
    value: "Sat",
    label: "Saturday",
  },
  {
    value: "Sun",
    label: "Sunday",
  },
];

const times = [
  { label: "7:00 AM", value: 7 },
  { label: "8:00 AM", value: 8 },
  { label: "9:00 AM", value: 9 },
  { label: "10:00 AM", value: 10 },
  { label: "11:00 AM", value: 11 },
  { label: "12:00 PM", value: 12 },
  { label: "1:00 PM", value: 13 },
  { label: "2:00 PM", value: 14 },
  { label: "3:00 PM", value: 15 },
  { label: "4:00 PM", value: 16 },
  { label: "5:00 PM", value: 17 },
];

const ScheduleViewer = ({ schedules = [] }) => {
  const [schedList, setSchedList] = useState([]);

  useEffect(() => {
    setSchedList([]);
    const formattedSched = [];
    schedules.forEach((schedule, pIdx) => {
      const { days, start, end } = schedule;
      days.forEach((day, cIdx) => {
        formattedSched.push({
          _key: `${pIdx}-${cIdx}`,
          day,
          start,
          end,
          ...schedule,
        });
      });
    });
    setSchedList(formattedSched);
  }, [schedules]);

  const handleHeight = (
    startTimeIndex,
    endedTimeIndex,
    timeIndex,
    startTime,
    endTime,
    color,
    endedGradient
  ) => {
    var _style = {
      marginTop: "0px",
      background: `linear-gradient(to bottom, ${color}, ${color})` /* Adjust colors as needed */,
      height: "100%",
      width: "100%",
      position: "absolute",
      overflow: "visible",
      left: "-6px",
      color: "black",
      fontWeight: "600",
      boxShadow: "0px 0px 0px 0px",
      backgroundSize: "",
    };

    if (timeIndex === endedTimeIndex) {
      if (endTime.min === "15") {
        _style.height = "68px";
        _style.marginTop = "-52px";
        _style.zIndex = 1;
      } else if (endTime.min === "30") {
        _style.marginTop = "-32px";
        _style.height = "61.4px";
      } else if (endTime.min === "45") {
        _style.marginTop = "-32px";
        _style.height = "80px";
        _style.zIndex = 1;
      } else {
        // 33px yan talaga height niya
        if (endedGradient) {
          _style.height = "64px";
          _style.background = `linear-gradient(to bottom, ${endedGradient} 100%,${color} 0%)`;
        } else {
          _style.height = "10px";
          _style.marginTop = "-26px";
        }
      }
    } else {
      _style.height = "65px";

      if (startTime.min === "30") {
        _style.height = "70px";
        _style.marginTop = "-31.5px"; // for 730
      }
    }

    if (startTime.min === "30") {
      _style.marginTop = "-30.8px"; // for 730
    }

    if (startTimeIndex === timeIndex) {
      const { hours } = startTime;
      if (hours === 7 && startTime.min == "0") {
        _style.marginTop = "-32px";
        _style.height = "95px";
      }
    }
    return _style;
  };

  return (
    <MDBTable>
      <thead>
        <th>Time</th>
        {days.map((day, index) => (
          <th className="text-center text-black  th-lg" key={index}>
            {day.label.toUpperCase()}
          </th>
        ))}
      </thead>
      <tbody>
        {times.map((time, index) => (
          <tr key={`time-${index}`}>
            <td>{time.label}</td>
            {days.map((day, dIdx) => {
              const template = schedList.filter(
                (sched) => sched.day === day.value
              );
              if (!template.length) return <td></td>;
              return (
                <td>
                  <MDBPopover placement="right" popover clickable>
                    <MDBBtn color={"primary"}>sdafasdf</MDBBtn>
                    <div>
                      <MDBPopoverBody className="text-center">
                        asdfasdf
                      </MDBPopoverBody>
                    </div>
                  </MDBPopover>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default ScheduleViewer;

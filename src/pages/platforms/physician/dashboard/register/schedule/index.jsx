import { useEffect, useState } from "react";
import EditableSelect from "../../../../../../components/customizable/editableSelect";
import { MDBCol, MDBInput, MDBRow, MDBBtn } from "mdbreact";
import Time from "./time";
import Difference from "./difference";
import utils from "./utils";
import Table from "./table";

const _form = {
  slot: 0,
  capacity: 0,
  duration: 15,
  type: "onsite",
  days: [],
  location: {},
  start: { hour: 7, min: 0 },
  end: { hour: 9, min: 0 },
};

const Schedule = ({ form, setForm }) => {
  const [schedule, setSchedule] = useState(_form);

  useEffect(() => {
    const { start, end } = schedule;

    // convert to minutes
    const startMinutes = start.hour * 60 + start.min;
    const endMinutes = end.hour * 60 + end.min;

    // max end time (17:00)
    const maxEndMinutes = 17 * 60;
    const targetEndMinutes = Math.min(startMinutes + 120, maxEndMinutes);

    // only update if not exactly 2 hours and not already equal to target
    if (endMinutes !== targetEndMinutes) {
      const newHour = Math.floor(targetEndMinutes / 60);
      const newMin = targetEndMinutes % 60;

      setSchedule((prev) => {
        // double check bago mag update
        if (prev.end.hour === newHour && prev.end.min === newMin) {
          return prev; // walang update
        }
        return {
          ...prev,
          end: { hour: newHour, min: newMin },
        };
      });
    }
  }, [schedule.start]);

  const handlePickDays = (day) => {
    const days = [...schedule.days];
    if (days.includes(day)) {
      days.splice(days.indexOf(day), 1);
    } else {
      days.push(day);
    }
    setSchedule({ ...schedule, days });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(utils.hasConflict(form?.schedules || [], schedule));
    setForm((prev) => ({
      ...prev,
      schedules: [...(prev?.schedules || []), schedule],
    }));
    setSchedule({
      ...schedule,
      days: [],
      start: { hour: 7, min: 0 },
      end: { hour: 9, min: 0 },
    });
  };

  const { location = {}, duration, type, slot, capacity } = schedule;
  return (
    <MDBRow>
      <MDBCol md="5">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Address"
                required
                value={location?.address}
                onChange={(e) =>
                  setSchedule({
                    ...schedule,
                    location: { ...location, address: e.target.value },
                  })
                }
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBInput
                label="Building"
                value={location?.building}
                onChange={(e) =>
                  setSchedule({
                    ...schedule,
                    location: { ...location, building: e.target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Floor"
                value={location?.floor}
                onChange={(e) =>
                  setSchedule({
                    ...schedule,
                    location: { ...location, floor: e.target.value },
                  })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Room"
                value={location?.room}
                onChange={(e) =>
                  setSchedule({
                    ...schedule,
                    location: { ...location, room: e.target.value },
                  })
                }
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol>
              <MDBInput
                required
                label="Duration in minutes"
                value={String(duration)}
                onChange={(e) =>
                  setSchedule({ ...schedule, duration: Number(e.target.value) })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Slot"
                required
                value={String(slot)}
                onChange={(e) =>
                  setSchedule({ ...schedule, slot: Number(e.target.value) })
                }
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                label="Capacity"
                required
                value={String(capacity)}
                onChange={(e) =>
                  setSchedule({ ...schedule, capacity: Number(e.target.value) })
                }
              />
            </MDBCol>
            <MDBCol>
              <div className="mt-4">
                <EditableSelect
                  collections={["onsite", "telemedicine"]}
                  label="Type"
                  preValue={type}
                  onChange={(e) => setSchedule({ ...schedule, type: e })}
                />
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <div className="d-flex justify-content-around">
                {["M", "T", "W", "TH", "F", "Sat", "Sun"].map((day) => (
                  <MDBBtn
                    rounded
                    floating
                    color="primary"
                    key={day}
                    outline={!schedule?.days?.includes(day)}
                    onClick={() => handlePickDays(day)}
                  >
                    {day}
                  </MDBBtn>
                ))}
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-3">
            <Time
              label="Start Time"
              baseKey="start"
              schedule={schedule}
              setSchedule={setSchedule}
            />
            <Time
              label="End Time"
              baseKey="end"
              schedule={schedule}
              setSchedule={setSchedule}
            />
          </MDBRow>
          <MDBRow>
            <MDBCol md="8">
              <Difference schedule={schedule} />
            </MDBCol>
            <MDBCol>
              <MDBBtn
                size="sm"
                color="info"
                type="submit"
                className="float-right"
                disabled={
                  utils.getDifference(schedule) < 120 || !schedule?.days?.length
                }
              >
                Add
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBCol>
      <MDBCol md="7">
        <Table form={form} setForm={setForm} />
      </MDBCol>
    </MDBRow>
  );
};

export default Schedule;

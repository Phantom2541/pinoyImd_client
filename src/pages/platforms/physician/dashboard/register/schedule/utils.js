import Swal from "sweetalert2";

const utils = {
  getDifference: (schedule) => {
    const startMinutes = schedule.start.hour * 60 + schedule.start.min;
    const endMinutes = schedule.end.hour * 60 + schedule.end.min;
    return endMinutes - startMinutes;
  },

  // helper to format time into 12-hour with AM/PM
  formatTime: (hour, min) => {
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const paddedMin = String(min).padStart(2, "0");
    return `${adjustedHour}:${paddedMin} ${period}`;
  },

  hasConflict: (schedules, schedule) => {
    let isConflict = false;
    let conflictDay = null;
    let conflictSchedule = null;

    for (let i = 0; i < schedules.length; i++) {
      const existSched = schedules[i];

      // check if same day
      const indexOfDay = schedule?.days?.findIndex((day) =>
        existSched?.days.includes(day)
      );

      if (indexOfDay > -1) {
        const startNew = schedule.start.hour * 60 + schedule.start.min;
        const endNew = schedule.end.hour * 60 + schedule.end.min;

        const startOld = existSched.start.hour * 60 + existSched.start.min;
        const endOld = existSched.end.hour * 60 + existSched.end.min;

        // overlap condition
        const overlap = startNew < endOld && endNew > startOld;

        if (overlap) {
          isConflict = true;
          conflictDay = existSched.days[indexOfDay]; // existing schedule days
          conflictSchedule = existSched;
          break;
        }
      }
    }

    if (isConflict && conflictSchedule) {
      const oldStart = utils.formatTime(
        conflictSchedule.start.hour,
        conflictSchedule.start.min
      );
      const oldEnd = utils.formatTime(
        conflictSchedule.end.hour,
        conflictSchedule.end.min
      );

      const oldTime = `${oldStart} - ${oldEnd}`;
      const address =
        conflictSchedule?.location?.address || "No address provided";

      Swal.fire({
        icon: "warning",
        title: "⚠️ Schedule Conflict",
        width: "30em",
        html: `
          A conflict was found on <b>${conflictDay}</b>.<br/>
           <b>${oldTime}</b><br/>
          <i>Location: ${address}</i><br/><br/>
          Please choose a different time to avoid conflicts.
        `,
        confirmButtonText: "Okay, I’ll adjust",
        confirmButtonColor: "#3085d6",
      });

      return true;
    }

    return false;
  },
};

export default utils;

const utils = {
  getDifference: (schedule) => {
    const startMinutes = schedule.start.hour * 60 + schedule.start.min;
    const endMinutes = schedule.end.hour * 60 + schedule.end.min;
    return endMinutes - startMinutes;
  },
  hasConflict: (schedules, schedule) => {
    let isConflict = false;
    let conflictDay = null;

    for (let i = 0; i < schedules.length; i++) {
      const element = schedules[i];
      const existSched = element.schedule;

      // check if same day
      const sameDay = schedule?.days?.some((day) =>
        element?.schedule?.days.includes(day)
      );

      if (sameDay) {
        const startNew = schedule.start.hour * 60 + schedule.start.min;
        const endNew = schedule.end.hour * 60 + schedule.end.min;

        const startOld = existSched.start.hour * 60 + existSched.start.min;
        const endOld = existSched.end.hour * 60 + existSched.end.min;

        // overlap condition
        const overlap = startNew < endOld && endNew > startOld;

        if (overlap) {
          isConflict = true;
          conflictDay = schedule.days.join(", ");
          break;
        }
      }
    }

    return { isConflict, conflictDay };
  },
};

export default utils;

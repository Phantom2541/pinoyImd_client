const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const helpers = {
  dayNames,

  isWeekDays: (dayOfWeek) => dayOfWeek !== "Sunday" && dayOfWeek !== "Saturday",

  addZero: (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  formatTime: (hours, minutes) => {
    let period = "AM";
    if (hours >= 12) {
      period = "PM";
      hours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
    } else if (hours === 0) {
      hours = 12; // Handle midnight (00:00)
    }
    return `${helpers.addZero(hours)}:${helpers.addZero(minutes)} ${period}`;
  },
  groupByDay: (chemistryData) => {
    return chemistryData.reduce((acc, chem) => {
      const createdAt = new Date(chem.createdAt); // assuming createdAt field exists
      const day = createdAt.getDate();

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(chem);
      return acc;
    }, {});
  },
};

export default helpers;

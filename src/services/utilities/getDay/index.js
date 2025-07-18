const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const getDay = (createdAt) => {
  const date = createdAt ? new Date(createdAt) : new Date();
  return days[date.getDay()];
};

export default getDay;

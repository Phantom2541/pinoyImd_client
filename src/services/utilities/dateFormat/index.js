// formats: June 29, 2025
const dateFormat = (newDate) =>
  newDate &&
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
  }).format(new Date(newDate));

// formats: 2:45 PM
const timeFormat = (newDate) =>
  newDate &&
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(newDate));

export { dateFormat, timeFormat };

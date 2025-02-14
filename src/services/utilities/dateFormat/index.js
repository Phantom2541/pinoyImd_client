const dateFormat = (newDate) =>
  newDate &&
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
  }).format(new Date(newDate));

export default dateFormat;

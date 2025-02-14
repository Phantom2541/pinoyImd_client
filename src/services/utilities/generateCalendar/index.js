const generateCalendar = (month, year) => {
  // Get the number of days in the specified month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Generate an array of day numbers for the specified month
  const daysArray = Array.from({ length: totalDays }, (_, i) => {
    const num = i + 1;

    return {
      num,
      txt: new Date(year, month, num).toDateString(),
    };
  });

  // Get the day of the week for the first day of the month
  const startingDay = new Date(year, month, 1).getDay();

  return [...Array(startingDay).fill({}), ...daysArray];
};

export default generateCalendar;

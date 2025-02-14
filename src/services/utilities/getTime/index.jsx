const getTime = (createdAt, ismilitary = false) => {
  if (!createdAt) return null; // Check if createdAt is not provided
  if (ismilitary) {
    const createdDate = new Date(createdAt); // Create a Date object from createdAt
    const hours = createdDate.getHours(); // Get hours (0-23)
    const minutes = createdDate.getMinutes(); // Get minutes (0-59)
    const seconds = createdDate.getSeconds(); // Get seconds (0-59)

    // Format the time as HH:MM:SS (e.g., 14:30:45)
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;
  } else {
    return new Date(createdAt).toLocaleString(undefined, {
      timeStyle: "short",
    });
  }
};

export default getTime;

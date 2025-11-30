// Calculate total hours between check-in and check-out
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;

  const diffMs = new Date(checkOut) - new Date(checkIn); // milliseconds
  const hours = diffMs / (1000 * 60 * 60); // convert to hours

  return Math.round(hours * 100) / 100; // round to 2 decimals
};

module.exports = calculateHours;

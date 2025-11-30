const { Parser } = require('json2csv');

// Convert attendance array to CSV
const exportCSV = (attendanceData) => {
  const fields = ['employeeId', 'name', 'date', 'checkInTime', 'checkOutTime', 'status', 'totalHours'];
  const parser = new Parser({ fields });

  // Convert objects to CSV
  return parser.parse(attendanceData);
};

module.exports = exportCSV;

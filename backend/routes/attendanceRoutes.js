const express = require('express');
const {
  checkIn,
  checkOut,
  myHistory,
  mySummary,
  allAttendance,
  employeeAttendance,
  exportAttendance,
  todayStatus,
  attendanceByDate,
  getAllEmployees,
  attendanceByDateRange,
  bulkUpdateAttendance,
  markMultiplePresent,
  markMultipleAbsent
} = require('../controllers/attendanceController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// ------------------- Employee Routes -------------------
// Mark check-in
router.post('/checkin', protect, authorize('employee'), checkIn);

// Mark check-out
router.post('/checkout', protect, authorize('employee'), checkOut);

// Get my attendance history
router.get('/my-history', protect, authorize('employee'), myHistory);

// Get my monthly summary
router.get('/my-summary', protect, authorize('employee'), mySummary);

// Get today's attendance status
router.get('/today', protect, authorize('employee'), todayStatus);

// ------------------- Manager Routes -------------------
// Get all employees (must be before /all to avoid conflicts)
router.get('/employees', protect, authorize('manager'), getAllEmployees);

// Get all employees attendance
router.get('/all', protect, authorize('manager'), allAttendance);

// Get specific employee attendance
router.get('/employee/:id', protect, authorize('manager'), employeeAttendance);

// Get attendance by date range
router.get('/date-range', protect, authorize('manager'), attendanceByDateRange);

// Export attendance CSV
router.get('/export', protect, authorize('manager'), exportAttendance);

// Get today's status for all employees
router.get('/today-status', protect, authorize('manager'), todayStatus);

// Bulk update attendance
router.put('/bulk-update', protect, authorize('manager'), bulkUpdateAttendance);

// Bulk mark as present
router.post('/bulk-present', protect, authorize('manager'), markMultiplePresent);

// Bulk mark as absent
router.post('/bulk-absent', protect, authorize('manager'), markMultipleAbsent);

// Get attendance by specific date (must be after other routes)
router.get('/date/:date', protect, authorize('manager'), attendanceByDate);

module.exports = router;

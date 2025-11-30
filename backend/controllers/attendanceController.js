cont// controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const calculateHours = require('../utils/calculateHours');
const exportCSV = require('../utils/exportCSV');

// ---------- Helpers ----------
/**
 * Parse input (Date object or "YYYY-MM-DD" string) to a Date at local start-of-day.
 * Returns a Date object representing local YYYY-MM-DD 00:00:00
 */
const parseDateOnly = (input) => {
  if (!input) return null;
  if (input instanceof Date) {
    // construct new Date with only year, month, day (local)
    return new Date(input.toDateString());
  }
  // if string like "2025-11-30" or "2025-11-30T12:00:00Z"
  // prefer YYYY-MM-DD parsing to avoid timezone issues
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    return new Date(y, m, d);
  }
  // fallback: try Date constructor then normalize
  const dt = new Date(input);
  return new Date(dt.toDateString());
};

const startOfDay = (d) => {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
};
const endOfDay = (d) => {
  const dt = new Date(d);
  dt.setHours(23, 59, 59, 999);
  return dt;
};

// ---------------- Employee Routes ----------------

// Employee: Check-in
const checkIn = async (req, res) => {
  try {
    const now = new Date();
    const date = parseDateOnly(now); // local start-of-day

    const existing = await Attendance.findOne({ userId: req.user._id, date });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    const attendance = await Attendance.create({
      userId: req.user._id,
      date,
      checkInTime: now
      // If you have pre-save hooks they can compute status/totalHours
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error('checkIn error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Employee: Check-out
const checkOut = async (req, res) => {
  try {
    const now = new Date();
    const date = parseDateOnly(now);

    const attendance = await Attendance.findOne({ userId: req.user._id, date });
    if (!attendance) return res.status(400).json({ message: 'Check-in first' });
    if (attendance.checkOutTime) return res.status(400).json({ message: 'Already checked out' });

    attendance.checkOutTime = now;

    // If you don't have pre-save hooks, compute totalHours and status here:
    if (attendance.checkInTime) {
      attendance.totalHours = calculateHours(attendance.checkInTime, attendance.checkOutTime);
      // half-day logic: treat less than 4 hours as half-day
      if (attendance.totalHours < 4) {
        attendance.status = 'half-day';
      } else if (!attendance.status) {
        // If status not set at check-in, default to present
        attendance.status = 'present';
      }
    }

    await attendance.save();

    res.json(attendance);
  } catch (err) {
    console.error('checkOut error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Employee: My attendance history
const myHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error('myHistory error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Employee: Monthly summary
const mySummary = async (req, res) => {
  try {
    const now = new Date();
    const monthStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    const monthEnd = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    const summary = await Attendance.find({
      userId: req.user._id,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    // Count present (include half-day & late as present)
    const present = summary.filter(a =>
      a.status === 'present' || a.status === 'half-day' || a.status === 'late'
    ).length;

    const halfDay = summary.filter(a => a.status === 'half-day').length;
    const late = summary.filter(a => a.status === 'late').length;
    const absent = summary.filter(a => a.status === 'absent').length;

    const totalHours = summary.reduce((sum, a) => sum + (a.totalHours || 0), 0);

    res.json({
      present,
      late,
      absent,
      halfDay,
      totalDays: summary.length,
      totalHours
    });
  } catch (err) {
    console.error('mySummary error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Manager Routes ----------------

// Manager: All employees attendance
const allAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().populate('userId', 'name employeeId department').sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error('allAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Specific employee
const employeeAttendance = async (req, res) => {
  try {
    const data = await Attendance.find({ userId: req.params.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error('employeeAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Export CSV
const exportAttendance = async (req, res) => {
  try {
    const data = await Attendance.find().populate('userId', 'name employeeId department');
    const csv = exportCSV(data.map(a => ({
      employeeId: a.userId.employeeId,
      name: a.userId.name,
      date: a.date,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      status: a.status,
      totalHours: a.totalHours
    })));

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    res.send(csv);
  } catch (err) {
    console.error('exportAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Today's status
const todayStatus = async (req, res) => {
  try {
    const today = parseDateOnly(new Date());
    const data = await Attendance.find({ date: today }).populate('userId', 'name employeeId department');
    res.json(data);
  } catch (err) {
    console.error('todayStatus error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Attendance by specific date (expects yyyy-mm-dd or Date)
const attendanceByDate = async (req, res) => {
  try {
    const dateParam = req.params.date;
    const date = parseDateOnly(dateParam);
    const data = await Attendance.find({ date }).populate('userId', 'name employeeId department');
    res.json(data);
  } catch (err) {
    console.error('attendanceByDate error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Get all employees list
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('_id name employeeId email department');
    res.json(employees);
  } catch (err) {
    console.error('getAllEmployees error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Attendance by date range (expects startDate & endDate query params in yyyy-mm-dd or Date)
const attendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const start = startOfDay(parseDateOnly(startDate));
    const end = endOfDay(parseDateOnly(endDate));

    const data = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('userId', 'name employeeId department').sort({ date: -1 });

    res.json(data);
  } catch (err) {
    console.error('attendanceByDateRange error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Bulk update attendance
const bulkUpdateAttendance = async (req, res) => {
  try {
    const { updates } = req.body; // Array of {attendanceId, status, notes}

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid updates data' });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const update of updates) {
      try {
        const { attendanceId, status, notes } = update;

        if (!['present', 'absent', 'late', 'half-day'].includes(status)) {
          failureCount++;
          results.push({
            attendanceId,
            success: false,
            error: 'Invalid status'
          });
          continue;
        }

        const attendance = await Attendance.findByIdAndUpdate(
          attendanceId,
          { status, notes, updatedAt: new Date() },
          { new: true }
        );

        if (!attendance) {
          failureCount++;
          results.push({
            attendanceId,
            success: false,
            error: 'Record not found'
          });
        } else {
          successCount++;
          results.push({
            attendanceId,
            success: true,
            message: 'Updated successfully'
          });
        }
      } catch (err) {
        failureCount++;
        results.push({
          attendanceId: update.attendanceId,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      message: 'Bulk update completed',
      summary: {
        total: updates.length,
        successful: successCount,
        failed: failureCount
      },
      results
    });
  } catch (err) {
    console.error('bulkUpdateAttendance error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Mark multiple employees as present
const markMultiplePresent = async (req, res) => {
  try {
    const { employeeIds, date } = req.body;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Invalid employee IDs' });
    }

    const attendanceDate = parseDateOnly(date);
    const results = [];

    for (const employeeId of employeeIds) {
      try {
        const existing = await Attendance.findOne({
          userId: employeeId,
          date: attendanceDate
        });

        if (existing) {
          results.push({
            employeeId,
            success: false,
            message: 'Record already exists'
          });
        } else {
          await Attendance.create({
            userId: employeeId,
            date: attendanceDate,
            checkInTime: attendanceDate,
            status: 'present'
          });

          results.push({
            employeeId,
            success: true,
            message: 'Marked as present'
          });
        }
      } catch (err) {
        results.push({
          employeeId,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      message: 'Bulk mark operation completed',
      results
    });
  } catch (err) {
    console.error('markMultiplePresent error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Manager: Mark multiple employees as absent
const markMultipleAbsent = async (req, res) => {
  try {
    const { employeeIds, date } = req.body;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Invalid employee IDs' });
    }

    const attendanceDate = parseDateOnly(date);
    const results = [];

    for (const employeeId of employeeIds) {
      try {
        const existing = await Attendance.findOne({
          userId: employeeId,
          date: attendanceDate
        });

        if (existing) {
          existing.status = 'absent';
          await existing.save();
          results.push({
            employeeId,
            success: true,
            message: 'Updated to absent'
          });
        } else {
          await Attendance.create({
            userId: employeeId,
            date: attendanceDate,
            status: 'absent'
          });

          results.push({
            employeeId,
            success: true,
            message: 'Marked as absent'
          });
        }
      } catch (err) {
        results.push({
          employeeId,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      message: 'Bulk mark absent operation completed',
      results
    });
  } catch (err) {
    console.error('markMultipleAbsent error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- Export all ----------------
module.exports = {
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
};

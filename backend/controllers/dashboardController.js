const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Employee dashboard
const employeeDashboard = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.find({ userId: req.user._id });
    const todayRecord = attendance.find(a => a.date.toISOString().split('T')[0] === today);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    const monthRecords = attendance.filter(a => a.date >= monthStart && a.date <= monthEnd);

    const present = monthRecords.filter(a => a.status === 'present' || a.status === 'half-day').length;
    const late = monthRecords.filter(a => a.status === 'late').length;
    const absent = monthRecords.filter(a => a.status === 'absent').length;
    const totalHours = monthRecords.reduce((acc, a) => acc + (a.totalHours || 0), 0);

    const last7Days = attendance.slice(-7);

    res.json({
      todayStatus: todayRecord ? todayRecord.status : 'Not Checked In',
      present,
      late,
      absent,
      totalHours,
      recentAttendance: last7Days
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager dashboard
const managerDashboard = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.find({ date: today });

    const present = todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const absent = totalEmployees - present;
    const late = todayAttendance.filter(a => a.status === 'late').length;

    // Weekly trend
    const past7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const count = await Attendance.countDocuments({ date: dayStr, status: 'present' });
      past7Days.push({ 
        name: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        date: dayStr, 
        present: count 
      });
    }

    // Department-wise
    const employees = await User.find({ role: 'employee' });
    const deptStats = {};
    for (let emp of employees) {
      const record = await Attendance.findOne({ userId: emp._id, date: today });
      if (!deptStats[emp.department]) deptStats[emp.department] = { present: 0, absent: 0 };
      if (record && (record.status === 'present' || record.status === 'late')) deptStats[emp.department].present += 1;
      else deptStats[emp.department].absent += 1;
    }

    // Convert departmentStats object to array for frontend
    const departmentStatsArray = Object.entries(deptStats).map(([dept, stats]) => ({
      name: dept,
      present: stats.present,
      absent: stats.absent
    }));

    res.json({
      totalEmployees,
      presentToday: present,
      absentToday: absent,
      lateToday: late,
      weeklyAttendance: past7Days,
      departmentStats: departmentStatsArray
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { employeeDashboard, managerDashboard };

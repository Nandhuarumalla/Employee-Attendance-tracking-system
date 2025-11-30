import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagerDashboard } from '../../api/dashboardApi';
import { getAllAttendance } from '../../api/attendanceApi';
import DashboardCharts from '../../components/manager/DashboardCharts';
import TodayAttendanceWidget from '../../components/manager/TodayAttendanceWidget';
import { exportCSV } from '../../utils/exportCSV';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getManagerDashboard();
      const data = res.data;
      setDashboard(data);
      setWeeklyData(Array.isArray(data.weeklyAttendance) ? data.weeklyAttendance : []);
      setDeptData(Array.isArray(data.departmentStats) ? data.departmentStats : []);

      // Fetch all attendance for export
      const attendanceRes = await getAllAttendance();
      setAllAttendance(attendanceRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportDashboard = () => {
    if (allAttendance.length === 0) {
      alert('No data to export');
      return;
    }

    const formattedData = allAttendance.map(item => {
      // Handle both populated and raw userId structures
      const employeeId = item.userId?.employeeId || item.user?.employeeId || '-';
      const name = item.userId?.name || item.user?.name || '-';
      const department = item.userId?.department || item.user?.department || '-';

      return {
        'Employee ID': employeeId,
        'Employee Name': name,
        'Department': department,
        'Date': item.date ? new Date(item.date).toLocaleDateString() : '-',
        'Check In Time': item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-',
        'Check Out Time': item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-',
        'Status': item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Absent',
        'Total Hours': item.totalHours ? item.totalHours.toString() : '0'
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportCSV(formattedData, `dashboard_attendance_${timestamp}.csv`);
  };

  return (
    <>
      <Navbar userRole="manager" userName={user?.name || 'Manager'} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manager Dashboard 📊</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your team's attendance overview.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleExportDashboard}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              📥 Export Data
            </button>
            <button
              onClick={() => navigate('/manager/reports')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              📊 Reports
            </button>
            <button
              onClick={() => navigate('/manager/team-calendar')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              📅 Team Calendar
            </button>
            <button
              onClick={() => navigate('/manager/all-attendance')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:scale-105 shadow-lg"
            >
              👥 View All Employees
            </button>
          </div>

          {/* Today's Attendance Widget */}
          <TodayAttendanceWidget />

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-sm font-semibold">Total Employees</h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">{dashboard.totalEmployees || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-sm font-semibold">Present Today</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{dashboard.presentToday || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-sm font-semibold">Absent Today</h2>
              <p className="text-4xl font-bold text-red-600 mt-2">{dashboard.absentToday || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-2xl transition">
              <h2 className="text-gray-600 text-sm font-semibold">Late Arrivals</h2>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{dashboard.lateToday || 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DashboardCharts data={weeklyData} dataKey="present" title="Weekly Attendance Trend" />
            <DashboardCharts data={deptData} dataKey="present" title="Department-wise Attendance" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

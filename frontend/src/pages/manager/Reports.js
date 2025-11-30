import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { getAllAttendance, getAllEmployees } from '../../api/attendanceApi';
import { exportCSV } from '../../utils/exportCSV';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Chart data states
  const [dailyTrendData, setDailyTrendData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [employeeStats, setEmployeeStats] = useState([]);

  // Initialize date range (current month)
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);

    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  // Process data for charts
  const processChartData = (data) => {
    // Daily Trend
    const dailyMap = {};
    data.forEach(item => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dailyMap[date]) {
        dailyMap[date] = { date, present: 0, absent: 0, late: 0, halfDay: 0 };
      }
      if (item.status === 'present') dailyMap[date].present++;
      if (item.status === 'absent') dailyMap[date].absent++;
      if (item.status === 'late') dailyMap[date].late++;
      if (item.status === 'half-day') dailyMap[date].halfDay++;
    });
    setDailyTrendData(Object.values(dailyMap).sort((a, b) => new Date(a.date) - new Date(b.date)));

    // Status Distribution
    const statusCount = {
      present: data.filter(a => a.status === 'present').length,
      absent: data.filter(a => a.status === 'absent').length,
      late: data.filter(a => a.status === 'late').length,
      halfDay: data.filter(a => a.status === 'half-day').length
    };
    setStatusDistribution([
      { name: 'Present', value: statusCount.present, fill: '#10b981' },
      { name: 'Absent', value: statusCount.absent, fill: '#ef4444' },
      { name: 'Late', value: statusCount.late, fill: '#f59e0b' },
      { name: 'Half-day', value: statusCount.halfDay, fill: '#f97316' }
    ]);

    // Department Stats
    const deptMap = {};
    data.forEach(item => {
      const dept = item.userId?.department || 'Unknown';
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, count: 0 };
      }
      deptMap[dept].count++;
    });
    setDepartmentStats(Object.values(deptMap));

    // Top Employees (by attendance count)
    const empMap = {};
    data.forEach(item => {
      const empId = item.userId?._id;
      const empName = item.userId?.name || 'Unknown';
      if (!empMap[empId]) {
        empMap[empId] = { name: empName, count: 0 };
      }
      empMap[empId].count++;
    });
    setEmployeeStats(Object.values(empMap).sort((a, b) => b.count - a.count).slice(0, 10));
  };

  // Fetch attendance data
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAllAttendance();
      setAttendance(res.data || []);
      filterAttendance(res.data || []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      alert('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Filter attendance based on date range and employee
  const filterAttendance = (data) => {
    let filtered = data;

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Filter by employee
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(
        (item) => item.userId?._id === selectedEmployee
      );
    }

    setFilteredAttendance(filtered);
    processChartData(filtered);
  };

  // Handle report generation
  const handleGenerateReport = () => {
    fetchAttendance();
  };

  // Handle filter changes
  useEffect(() => {
    if (attendance.length > 0) {
      filterAttendance(attendance);
    }
  }, [selectedEmployee]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredAttendance.length === 0) {
      alert('No data to export. Please generate a report first.');
      return;
    }

    const formattedData = filteredAttendance.map(item => ({
      'Employee ID': item.userId?.employeeId || '-',
      'Name': item.userId?.name || '-',
      'Department': item.userId?.department || '-',
      'Date': new Date(item.date).toLocaleDateString(),
      'Check In Time': item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-',
      'Check Out Time': item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-',
      'Status': item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-',
      'Total Hours': item.totalHours || '0'
    }));

    const dateRange = `${startDate}_to_${endDate}`;
    exportCSV(formattedData, `attendance_report_${dateRange}.csv`);
  };

  // Calculate summary statistics
  const summary = {
    totalRecords: filteredAttendance.length,
    presentDays: filteredAttendance.filter(a => a.status === 'present').length,
    absentDays: filteredAttendance.filter(a => a.status === 'absent').length,
    lateDays: filteredAttendance.filter(a => a.status === 'late').length,
    halfDays: filteredAttendance.filter(a => a.status === 'half-day').length,
    totalHours: filteredAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0).toFixed(2)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/manager/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 text-lg"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Attendance Reports</h1>
        <p className="text-gray-600 mb-8">Comprehensive analytics and attendance insights</p>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Filters & Generate</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              >
                <option value="all">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Generate and Export Buttons */}
            <div className="flex gap-2 items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
              >
                {loading ? 'Loading...' : 'Generate'}
              </button>
              <button
                onClick={handleExportCSV}
                disabled={filteredAttendance.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
              >
                📥 Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {filteredAttendance.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
              <p className="text-sm font-semibold text-gray-700">Total Records</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalRecords}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg border-l-4 border-green-600">
              <p className="text-sm font-semibold text-gray-700">Present</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{summary.presentDays}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-lg border-l-4 border-red-600">
              <p className="text-sm font-semibold text-gray-700">Absent</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{summary.absentDays}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-lg border-l-4 border-yellow-600">
              <p className="text-sm font-semibold text-gray-700">Late</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{summary.lateDays}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg border-l-4 border-orange-600">
              <p className="text-sm font-semibold text-gray-700">Half-day</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{summary.halfDays}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg border-l-4 border-purple-600">
              <p className="text-sm font-semibold text-gray-700">Total Hours</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{summary.totalHours}</p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {filteredAttendance.length > 0 && (
          <>
            {/* Daily Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Attendance Trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dailyTrendData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" />
                  <Area type="monotone" dataKey="absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" />
                  <Area type="monotone" dataKey="late" stroke="#f59e0b" />
                  <Area type="monotone" dataKey="halfDay" stroke="#f97316" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution & Department Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Status Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} records`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Department Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Attendance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Records" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Employees Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 10 Most Attended Employees</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={employeeStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" name="Attendance Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Table Section */}
        {filteredAttendance.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="p-4 text-left font-semibold text-gray-900">Employee ID</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Name</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Department</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Date</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Check In</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Check Out</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Status</th>
                    <th className="p-4 text-left font-semibold text-gray-900">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((item) => (
                    <tr key={item._id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-4">{item.userId?.employeeId || '-'}</td>
                      <td className="p-4">{item.userId?.name || '-'}</td>
                      <td className="p-4">{item.userId?.department || '-'}</td>
                      <td className="p-4">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="p-4">{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-'}</td>
                      <td className="p-4">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-'}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {item.status || '-'}
                        </span>
                      </td>
                      <td className="p-4">{item.totalHours || '0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAttendance.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <p className="text-xl text-gray-600">
              {loading
                ? 'Loading attendance data...'
                : 'No attendance records found. Select filters and click "Generate" to view reports.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

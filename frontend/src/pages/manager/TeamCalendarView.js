import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAttendance } from '../../api/attendanceApi';
import TeamTable from '../../components/manager/TeamTable';
import { exportCSV } from '../../utils/exportCSV';

const TeamCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [monthAttendance, setMonthAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMonthAttendance();
  }, [currentDate]);

  const fetchMonthAttendance = async () => {
    try {
      setLoading(true);
      const res = await getAllAttendance();
      const allData = res.data || [];
      
      // Filter data for current month
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const filtered = allData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthStart && itemDate <= monthEnd;
      });
      
      setMonthAttendance(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get attendance for selected date
  const getDateAttendance = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return monthAttendance.filter(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      return itemDate === dateStr;
    });
  };

  // Get status summary for a date
  const getDateSummary = (date) => {
    const dateAttendance = getDateAttendance(date);
    const present = dateAttendance.filter(a => a.status === 'present').length;
    const absent = dateAttendance.filter(a => a.status === 'absent').length;
    const late = dateAttendance.filter(a => a.status === 'late').length;
    const halfDay = dateAttendance.filter(a => a.status === 'half-day').length;
    
    return { present, absent, late, halfDay, total: dateAttendance.length };
  };

  const getDayColor = (date) => {
    const summary = getDateSummary(date);
    if (summary.total === 0) return 'bg-gray-100';
    if (summary.absent > 0) return 'bg-red-100';
    if (summary.late > 0) return 'bg-yellow-100';
    if (summary.halfDay > 0) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleExportMonth = () => {
    if (monthAttendance.length === 0) {
      alert('No data to export');
      return;
    }

    const formattedData = monthAttendance.map(item => {
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

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    exportCSV(formattedData, `team_calendar_${monthName}.csv`);
  };

  // Generate calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

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
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Team Calendar View</h1>

        {/* Calendar Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <div className="flex gap-3">
              <button
                onClick={handlePrevMonth}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                ← Previous
              </button>
              <button
                onClick={handleToday}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Next →
              </button>
              <button
                onClick={handleExportMonth}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                📥 Export Month
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-bold text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="aspect-square"></div>;
              }

              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const summary = getDateSummary(date);
              const isToday = 
                date.toDateString() === new Date().toDateString();
              const color = getDayColor(date);

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 rounded-lg border-2 ${
                    isToday ? 'border-blue-600' : 'border-gray-200'
                  } ${color} cursor-pointer hover:shadow-lg transition`}
                >
                  <div className="text-right font-bold text-gray-900 mb-1">{day}</div>
                  {summary.total > 0 && (
                    <div className="text-xs space-y-0.5">
                      {summary.present > 0 && <div className="text-green-700">🟢 {summary.present}</div>}
                      {summary.absent > 0 && <div className="text-red-700">🔴 {summary.absent}</div>}
                      {summary.late > 0 && <div className="text-yellow-700">🟡 {summary.late}</div>}
                      {summary.halfDay > 0 && <div className="text-orange-700">🟠 {summary.halfDay}</div>}
                    </div>
                  )}
                  {summary.total === 0 && <div className="text-xs text-gray-500">No data</div>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded"></div>
                <span>🟢 Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded"></div>
                <span>🔴 Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-100 rounded"></div>
                <span>🟡 Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded"></div>
                <span>🟠 Half-day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats for Current Month */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Month Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-600">
              <p className="text-sm font-semibold text-gray-700">Total Present</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {monthAttendance.filter(a => a.status === 'present').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-l-4 border-red-600">
              <p className="text-sm font-semibold text-gray-700">Total Absent</p>
              <p className="text-4xl font-bold text-red-600 mt-2">
                {monthAttendance.filter(a => a.status === 'absent').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-600">
              <p className="text-sm font-semibold text-gray-700">Total Late</p>
              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {monthAttendance.filter(a => a.status === 'late').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-l-4 border-orange-600">
              <p className="text-sm font-semibold text-gray-700">Total Half-day</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">
                {monthAttendance.filter(a => a.status === 'half-day').length}
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Table for Current Month */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Month Attendance Records</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : monthAttendance.length > 0 ? (
            <TeamTable data={monthAttendance} />
          ) : (
            <p className="text-center text-gray-600 py-8">No attendance records for this month</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCalendarView;

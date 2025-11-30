import React, { useEffect, useState } from 'react';
import { getTodayAttendanceStatus, getAllAttendance } from '../../api/attendanceApi';

const TodayAttendanceWidget = () => {
  const [todayData, setTodayData] = useState({
    present: 0,
    late: 0,
    absent: 0,
    total: 0,
    lateEmployees: [],
    absentEmployees: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const res = await getAllAttendance();
      const allRecords = res.data || [];

      // Filter today's records
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = allRecords.filter(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });

      const present = todayRecords.filter(r => r.status === 'present').length;
      const late = todayRecords.filter(r => r.status === 'late').length;
      const absent = todayRecords.filter(r => r.status === 'absent').length;

      // Get late employees details
      const lateEmployees = todayRecords
        .filter(r => r.status === 'late')
        .map(r => {
          const user = r.user || r.userId;
          return {
            name: user?.name || 'Unknown',
            employeeId: user?.employeeId || 'N/A',
            checkInTime: r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'
          };
        });

      // Get absent employees details
      const absentEmployees = todayRecords
        .filter(r => r.status === 'absent')
        .map(r => {
          const user = r.user || r.userId;
          return {
            name: user?.name || 'Unknown',
            employeeId: user?.employeeId || 'N/A'
          };
        });

      setTodayData({
        present,
        late,
        absent,
        total: todayRecords.length,
        lateEmployees,
        absentEmployees
      });
    } catch (err) {
      console.error('Failed to fetch today data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-gray-600">Loading today's attendance...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Today's Attendance</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-gray-600 text-sm">Present</p>
          <p className="text-3xl font-bold text-green-600">{todayData.present}</p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-gray-600 text-sm">Late</p>
          <p className="text-3xl font-bold text-yellow-600">{todayData.late}</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-gray-600 text-sm">Absent</p>
          <p className="text-3xl font-bold text-red-600">{todayData.absent}</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Checked</p>
          <p className="text-3xl font-bold text-blue-600">{todayData.present + todayData.late}</p>
        </div>
      </div>

      {/* Late Arrivals */}
      {todayData.lateEmployees.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-3">🕒 Late Arrivals ({todayData.lateEmployees.length})</h3>
          <div className="space-y-2">
            {todayData.lateEmployees.map((emp, idx) => (
              <div key={idx} className="bg-yellow-50 p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{emp.name}</p>
                  <p className="text-sm text-gray-600">ID: {emp.employeeId}</p>
                </div>
                <p className="text-sm font-semibold text-orange-600">Check-in: {emp.checkInTime}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Absent */}
      {todayData.absentEmployees.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-3">❌ Absent ({todayData.absentEmployees.length})</h3>
          <div className="space-y-2">
            {todayData.absentEmployees.map((emp, idx) => (
              <div key={idx} className="bg-red-50 p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{emp.name}</p>
                  <p className="text-sm text-gray-600">ID: {emp.employeeId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayData.absent === 0 && todayData.late === 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
          <p className="text-green-700 font-semibold">✓ All employees present and on time!</p>
        </div>
      )}
    </div>
  );
};

export default TodayAttendanceWidget;

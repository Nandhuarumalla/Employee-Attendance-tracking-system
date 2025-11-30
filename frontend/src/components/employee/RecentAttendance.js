import React, { useEffect, useState } from 'react';
import { getMyHistory } from '../../api/attendanceApi';
import { exportCSV } from '../../utils/exportCSV';

const RecentAttendance = () => {
  const [recentData, setRecentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentAttendance();
  }, []);

  const fetchRecentAttendance = async () => {
    try {
      setLoading(true);
      const res = await getMyHistory();
      const allData = res.data || [];
      
      // Get last 7 days of attendance
      const sortedData = allData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7);
      
      setRecentData(sortedData);
    } catch (err) {
      console.error('Failed to fetch recent attendance:', err);
      setRecentData([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportCSV = () => {
    if (recentData.length === 0) {
      alert('No data to export');
      return;
    }

    const exportData = recentData.map(record => ({
      Date: new Date(record.date).toLocaleDateString(),
      'Check In': record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A',
      'Check Out': record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A',
      Status: record.status || 'N/A',
      'Total Hours': record.totalHours || '0'
    }));

    const timestamp = new Date().toISOString().slice(0, 10);
    exportCSV(exportData, `attendance_${timestamp}.csv`);
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (recentData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        No recent attendance records
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Attendance (Last 7 Days)</h2>
        <button
          onClick={handleExportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
        >
          📥 Export CSV
        </button>
      </div>
      <div className="space-y-3">
        {recentData.map((record) => (
          <div key={record._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600">
                {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} 
                {' - '}
                {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">
                {record.totalHours || '0'} hrs
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                {record.status || 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAttendance;

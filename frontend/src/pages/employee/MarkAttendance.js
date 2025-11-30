import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIn, checkOut, getTodayStatus } from '../../api/attendanceApi';

const MarkAttendance = () => {
  const [todayStatus, setTodayStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const res = await getTodayStatus();
      const status = res.data?.[0]?.status || 'Not Checked In';
      setTodayStatus(status);
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await checkIn();
      await fetchStatus();
      alert('Check-in successful!');
    } catch (err) {
      console.error('Check-in failed:', err);
      alert('Failed to check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await checkOut();
      await fetchStatus();
      alert('Check-out successful!');
    } catch (err) {
      console.error('Check-out failed:', err);
      alert('Failed to check-out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600';
      case 'late':
        return 'text-orange-600';
      case 'absent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employee/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-8">Mark Attendance</h1>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <p className="text-gray-600 mb-2">Today's Status:</p>
        <p className={`text-4xl font-bold mb-4 ${getStatusColor(todayStatus)}`}>
          {todayStatus || 'Not Checked In'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={todayStatus === 'present' || todayStatus === 'late' ? handleCheckOut : handleCheckIn}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-bold text-white transition ${
            todayStatus === 'present' || todayStatus === 'late'
              ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
              : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
          }`}
        >
          {loading ? 'Processing...' : todayStatus === 'present' || todayStatus === 'late' ? 'Check Out' : 'Check In'}
        </button>
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;

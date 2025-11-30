import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHistory } from '../../api/attendanceApi';
import AttendanceTable from '../../components/employee/AttendanceTable';
import AttendanceCalendar from '../../components/employee/AttendanceCalendar';
import AttendanceDetailsModal from '../../components/employee/AttendanceDetailsModal';

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'table'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getMyHistory();
        setHistory(res.data || []);
        setFilteredHistory(res.data || []);
      } catch (err) {
        console.error('Failed to fetch attendance history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Handle date click from calendar
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().split('T')[0];
    const record = history.find(
      (h) => new Date(h.date).toISOString().split('T')[0] === dateStr
    );
    setSelectedRecord(record || null);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-4">My Attendance History</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employee/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">My Attendance History</h1>

      {/* View Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-6 py-2 rounded font-semibold transition ${
            viewMode === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-6 py-2 rounded font-semibold transition ${
            viewMode === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Table View
        </button>
      </div>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-2xl font-bold">{history.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Present Days</p>
            <p className="text-2xl font-bold text-green-600">
              {history.filter((h) => h.status === 'present').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Late Days</p>
            <p className="text-2xl font-bold text-yellow-600">
              {history.filter((h) => h.status === 'late').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Absent Days</p>
            <p className="text-2xl font-bold text-red-600">
              {history.filter((h) => h.status === 'absent').length}
            </p>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <>
          <AttendanceCalendar
            data={history}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div>
          {history.length > 0 ? (
            <AttendanceTable data={history} />
          ) : (
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-gray-600">No attendance records found.</p>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <AttendanceDetailsModal
        record={selectedRecord}
        selectedDate={selectedDate}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AttendanceHistory;

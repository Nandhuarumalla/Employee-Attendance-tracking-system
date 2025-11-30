import React from 'react';

const AttendanceDetailsModal = ({ record, selectedDate, onClose }) => {
  if (!record && !selectedDate) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600';
      case 'late':
        return 'text-yellow-600';
      case 'absent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100';
      case 'late':
        return 'bg-yellow-100';
      case 'absent':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Attendance Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {record ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <p className="text-lg font-semibold">
                {new Date(record.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${getStatusBg(
                  record.status
                )} ${getStatusColor(record.status)}`}
              >
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check In Time
              </label>
              <p className="text-lg font-semibold">
                {record.checkInTime
                  ? new Date(record.checkInTime).toLocaleTimeString()
                  : 'Not checked in'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check Out Time
              </label>
              <p className="text-lg font-semibold">
                {record.checkOutTime
                  ? new Date(record.checkOutTime).toLocaleTimeString()
                  : 'Not checked out'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Hours Worked
              </label>
              <p className="text-lg font-semibold">
                {record.totalHours ? `${record.totalHours} hours` : '0 hours'}
              </p>
            </div>

            {record.checkInTime && record.checkOutTime && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Duration:</span> From{' '}
                  {new Date(record.checkInTime).toLocaleTimeString()} to{' '}
                  {new Date(record.checkOutTime).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              No attendance record for this date
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;

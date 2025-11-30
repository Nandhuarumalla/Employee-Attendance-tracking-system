import React, { useState } from 'react';

// ⭐ FIX: Convert date to local YYYY-MM-DD without timezone issues
const formatLocalDate = (date) => {
  const yr = date.getFullYear();
  const mn = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yr}-${mn}-${dd}`;
};

const AttendanceCalendar = ({ data, onDateClick, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ⭐ FIX attendanceMap – Use local date (no UTC shifting)
  const attendanceMap = {};
  data.forEach((record) => {
    const dateStr = formatLocalDate(new Date(record.date));
    attendanceMap[dateStr] = record;
  });

  // Days in current month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // First day of month (0 = Sun, 1 = Mon…)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Colors based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-500 text-white';
      case 'late':
        return 'bg-yellow-500 text-white';
      case 'absent':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'P';
      case 'late':
        return 'L';
      case 'absent':
        return 'A';
      default:
        return '';
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells before 1st day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // ⭐ FIX: Generate month days without UTC shift
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i
    );

    const dateStr = formatLocalDate(dateObj);

    days.push({
      day: i,
      dateStr,
      record: attendanceMap[dateStr],
    });
  }

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const selectedDateStr = selectedDate ? formatLocalDate(selectedDate) : null;

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-2 rounded"
          >
            ← Prev
          </button>
          <button
            onClick={handleToday}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-2 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-500 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
          <span>No Record</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-700 p-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index}>
            {day ? (
              <button
                onClick={() => onDateClick(new Date(day.dateStr))}
                className={`w-full aspect-square rounded flex flex-col items-center justify-center font-semibold text-sm transition-all hover:scale-105 ${
                  day.record
                    ? getStatusColor(day.record.status)
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                } ${
                  selectedDateStr === day.dateStr ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <span>{day.day}</span>
                {day.record && (
                  <span className="text-xs mt-1 opacity-75">
                    {getStatusText(day.record.status)}
                  </span>
                )}
              </button>
            ) : (
              <div className="w-full aspect-square rounded bg-gray-50"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceCalendar;

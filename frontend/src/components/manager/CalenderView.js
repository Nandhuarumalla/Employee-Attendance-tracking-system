import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ onDateChange }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Team Attendance Calendar</h2>
      <Calendar onChange={onDateChange} />
    </div>
  );
};

export default CalendarView;

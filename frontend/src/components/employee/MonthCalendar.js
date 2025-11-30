import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MonthCalendar = ({ attendanceData = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert ANY date to LOCAL YYYY-MM-DD (without UTC shift)
  const toLocalDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Check which status to show (present/absent)
  const getAttendanceStatus = (day) => {
    const dayLocal = toLocalDateString(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );

    const record = attendanceData.find(
      (a) => toLocalDateString(a.date) === dayLocal
    );

    return record ? record.status : null;
  };

  // Generate days of the month
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentDay = 1;

  for (let i = 0; i < 6; i++) {
    const week = [];

    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || currentDay > daysInMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
        currentDay++;
      }
    }
    weeks.push(week);
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-200 rounded-full">
          <FiChevronLeft size={24} />
        </button>

        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button onClick={nextMonth} className="p-2 hover:bg-gray-200 rounded-full">
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 text-center gap-2">
        {weeks.map((week, i) =>
          week.map((day, j) => {
            if (!day) return <div key={`${i}-${j}`} className="h-12"></div>;

            const status = getAttendanceStatus(day);

            return (
              <div
                key={`${i}-${j}`}
                className={`
                  h-12 flex items-center justify-center rounded-lg text-sm
                  ${status === "Present" ? "bg-green-200 text-green-800" : ""}
                  ${status === "Absent" ? "bg-red-200 text-red-800" : ""}
                `}
              >
                {day}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthCalendar;

import React from 'react';

const AttendanceCard = ({ title, count, color }) => {
  return (
    <div className={`p-4 rounded shadow text-white ${color} text-center`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{count}</p>
    </div>
  );
};

export default AttendanceCard;

import React from 'react';
import AttendanceCard from './AttendanceCard';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
      <AttendanceCard title="Present Days" count={stats.present} color="bg-green-500" />
      <AttendanceCard title="Absent Days" count={stats.absent} color="bg-red-500" />
      <AttendanceCard title="Late Days" count={stats.late} color="bg-yellow-500" />
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
        <h3 className="font-semibold text-sm opacity-90">Total Hours This Month</h3>
        <p className="text-4xl font-bold mt-4">{stats.totalHours || '0'}</p>
        <p className="text-xs opacity-75 mt-2">hours</p>
      </div>
    </div>
  );
};

export default DashboardStats;

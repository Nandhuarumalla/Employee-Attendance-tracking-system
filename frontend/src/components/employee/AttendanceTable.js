import React from 'react';

const AttendanceTable = ({ data }) => {
  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2">Date</th>
          <th className="p-2">Check In</th>
          <th className="p-2">Check Out</th>
          <th className="p-2">Status</th>
          <th className="p-2">Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="text-center border-t">
            <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
            <td className="p-2">{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-'}</td>
            <td className="p-2">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-'}</td>
            <td className="p-2">{item.status}</td>
            <td className="p-2">{item.totalHours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceTable;

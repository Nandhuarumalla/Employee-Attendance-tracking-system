import React from 'react';

const TeamTable = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow text-center">
        <p className="text-gray-600">No attendance records found.</p>
      </div>
    );
  }

  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2">Employee ID</th>
          <th className="p-2">Name</th>
          <th className="p-2">Department</th>
          <th className="p-2">Date</th>
          <th className="p-2">Check In</th>
          <th className="p-2">Check Out</th>
          <th className="p-2">Status</th>
          <th className="p-2">Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          // Get user data from either item.user or item.userId (populated)
          const user = item.user || item.userId;
          
          return (
            <tr key={item._id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{user?.employeeId || '-'}</td>
              <td className="p-2">{user?.name || '-'}</td>
              <td className="p-2">{user?.department || '-'}</td>
              <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
              <td className="p-2">{item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-'}</td>
              <td className="p-2">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-'}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    item.status === 'present'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'late'
                      ? 'bg-yellow-100 text-yellow-800'
                      : item.status === 'absent'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status || '-'}
                </span>
              </td>
              <td className="p-2">{item.totalHours || '0'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TeamTable;

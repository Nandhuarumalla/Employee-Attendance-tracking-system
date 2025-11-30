import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getLoggedInUser } from '../../api/authApi';
import { getMySummary } from '../../api/attendanceApi';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await getLoggedInUser();
        // Handle both response structures
        const userData = res.user || res;
        setUser(userData);

        // Fetch monthly attendance summary
        const summaryRes = await getMySummary();
        const summaryData = summaryRes.data || summaryRes;
        setAttendanceSummary(summaryData);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleGoBack = () => {
    navigate('/employee/dashboard');
  };

  if (loading || !user) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            ← Back
          </button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user.name) {
    return (
      <div className="p-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
        >
          ← Back to Dashboard
        </button>
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 text-lg"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-12 text-gray-900">My Profile</h1>

      {/* Profile Card */}
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-2xl overflow-hidden mb-12">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-10 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-blue-600">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-4xl font-bold">{user.name}</h2>
                <p className="text-blue-100 text-lg mt-2">{user.role === 'employee' ? 'Employee' : 'Manager'}</p>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Employee ID
                  </label>
                  <p className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition">
                    {user.employeeId || 'N/A'}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Email Address
                  </label>
                  <p className="text-lg font-semibold text-gray-900 bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition break-all">
                    {user.email || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Department
                  </label>
                  <p className="text-2xl font-bold text-gray-900 bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition">
                    {user.department || 'N/A'}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Role
                  </label>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-6 py-3 rounded-full font-bold text-white text-lg shadow-lg ${
                        user.role === 'employee'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700'
                      }`}
                    >
                      {user.role === 'employee' ? 'Employee' : 'Manager'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Section */}
            <div className="mt-12 pt-12 border-t-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-700">
                <p>
                  <span className="font-bold text-gray-900">Account Type:</span> {user.role === 'employee' ? 'Employee Account' : 'Manager Account'}
                </p>
                <p>
                  <span className="font-bold text-gray-900">Member Since:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 col-span-full mt-4">
                  ✓ All your personal information is secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Pie Chart Section */}
      {attendanceSummary && (
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Monthly Attendance Summary</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Pie Chart */}
              <div className="flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Present', value: attendanceSummary.present || 0, fill: '#10b981' },
                        { name: 'Absent', value: attendanceSummary.absent || 0, fill: '#ef4444' },
                        { name: 'Late', value: attendanceSummary.late || 0, fill: '#f59e0b' },
                        { name: 'Half-day', value: attendanceSummary.halfDay || 0, fill: '#f97316' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#f97316" />
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `${value} days`}
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #ccc', borderRadius: '8px' }}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Statistics Cards */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 border-l-8 border-green-600 shadow-lg hover:shadow-xl transition">
                  <p className="text-lg font-semibold text-gray-700 mb-2">Present Days</p>
                  <p className="text-5xl font-bold text-green-600">{attendanceSummary.present || 0}</p>
                  <p className="text-sm text-gray-600 mt-3">Days you were present</p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8 border-l-8 border-red-600 shadow-lg hover:shadow-xl transition">
                  <p className="text-lg font-semibold text-gray-700 mb-2">Absent Days</p>
                  <p className="text-5xl font-bold text-red-600">{attendanceSummary.absent || 0}</p>
                  <p className="text-sm text-gray-600 mt-3">Days you were absent</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-8 border-l-8 border-yellow-600 shadow-lg hover:shadow-xl transition">
                  <p className="text-lg font-semibold text-gray-700 mb-2">Late Days</p>
                  <p className="text-5xl font-bold text-yellow-600">{attendanceSummary.late || 0}</p>
                  <p className="text-sm text-gray-600 mt-3">Days you arrived late</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border-l-8 border-orange-600 shadow-lg hover:shadow-xl transition">
                  <p className="text-lg font-semibold text-gray-700 mb-2">Half-day</p>
                  <p className="text-5xl font-bold text-orange-600">{attendanceSummary.halfDay || 0}</p>
                  <p className="text-sm text-gray-600 mt-3">Days marked as half-day</p>
                </div>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-12 pt-12 border-t-2 border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">Total Working Days</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{(attendanceSummary.present || 0) + (attendanceSummary.late || 0)}</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {Math.round(
                      ((attendanceSummary.present || 0) / Math.max((attendanceSummary.present || 0) + (attendanceSummary.absent || 0) + (attendanceSummary.late || 0), 1)) * 100
                    )}%
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">Total Days Recorded</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {(attendanceSummary.present || 0) + (attendanceSummary.absent || 0) + (attendanceSummary.late || 0) + (attendanceSummary.halfDay || 0)}
                  </p>
                </div>
                <div className="text-center p-6 bg-indigo-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600">On Time Rate</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {Math.round(
                      ((attendanceSummary.present || 0) / Math.max((attendanceSummary.present || 0) + (attendanceSummary.late || 0), 1)) * 100
                    )}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

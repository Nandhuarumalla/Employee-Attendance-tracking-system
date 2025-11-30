import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmployeeDashboard } from '../../api/dashboardApi';
import { checkIn, checkOut, getTodayStatus } from '../../api/attendanceApi';
import DashboardStats from '../../components/employee/DashboardStats';
import MonthCalendar from '../../components/employee/MonthCalendar';
import RecentAttendance from '../../components/employee/RecentAttendance';
import Navbar from '../../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({ present: 0, late: 0, absent: 0, totalHours: 0 });
  const [todayStatus, setTodayStatus] = useState('Not Checked In');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingInOut, setCheckingInOut] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // Get stats
      const statsRes = await getEmployeeDashboard();
      const statsData = statsRes.data || {};
      
      // Calculate total hours this month
      const totalHours = (statsData.totalHours || 0).toFixed(2);
      
      setDashboard({
        present: statsData.present || 0,
        late: statsData.late || 0,
        absent: statsData.absent || 0,
        totalHours: totalHours
      });

      // Get today attendance
      const statusRes = await getTodayStatus();
      const userId = JSON.parse(localStorage.getItem('user')).id;

      const todayAttendance = statusRes.data?.find(a => a.userId._id === userId);
      const status = todayAttendance ? todayAttendance.status : 'Not Checked In';
      
      setTodayStatus(status);
      setIsCheckedIn(status === 'present' || status === 'late');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingInOut(true);
      await checkIn();
      setTodayStatus('present');
      setIsCheckedIn(true);
    } catch (err) {
      console.error('Check-in failed:', err);
    } finally {
      setCheckingInOut(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setCheckingInOut(true);
      await checkOut();
      setTodayStatus('Checked Out');
      setIsCheckedIn(false);
    } catch (err) {
      console.error('Check-out failed:', err);
    } finally {
      setCheckingInOut(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar userRole="employee" userName={user?.name || 'Employee'} />
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userRole="employee" userName={user?.name || 'Employee'} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Today's Status Card */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl shadow-2xl p-8 md:p-10 mb-8 hover:shadow-3xl transition duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm opacity-90 font-semibold uppercase tracking-wider">TODAY'S STATUS</p>
                <p className="text-5xl font-bold mt-3">
                  {isCheckedIn ? '✓ Checked In' : '✗ Not Checked In'}
                </p>
                <p className="text-sm opacity-75 mt-3">
                  Status: <span className="font-semibold text-lg">{todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)}</span>
                </p>
              </div>
              <button
                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                disabled={checkingInOut}
                className={`px-10 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
                  isCheckedIn
                    ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-400'
                    : 'bg-green-500 hover:bg-green-600 disabled:bg-green-400'
                } text-white shadow-lg`}
              >
                {checkingInOut ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}
              </button>
            </div>
          </div>

          {/* This Month Stats */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">This Month Overview</h2>
          <DashboardStats stats={dashboard} />

          {/* Recent Attendance */}
          <RecentAttendance />

          {/* Calendar View */}
          <MonthCalendar />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

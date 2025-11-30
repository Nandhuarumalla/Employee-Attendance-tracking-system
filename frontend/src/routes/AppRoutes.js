import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import MarkAttendance from '../pages/employee/MarkAttendance';
import AttendanceHistory from '../pages/employee/AttendanceHistory';
import Profile from '../pages/employee/Profile';

// Manager Pages
import ManagerDashboard from '../pages/manager/Dashboard';
import AllEmployeesAttendance from '../pages/manager/AllEmployeesAttendance';
import TeamCalendarView from '../pages/manager/TeamCalendarView';
import Reports from '../pages/manager/Reports';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // get user object
  const userRole = user?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/login" replace />; // or some error page
  }

  return children;
};


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/mark-attendance"
          element={
            <ProtectedRoute role="employee">
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/attendance-history"
          element={
            <ProtectedRoute role="employee">
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute role="employee">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/all-attendance"
          element={
            <ProtectedRoute role="manager">
              <AllEmployeesAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/team-calendar"
          element={
            <ProtectedRoute role="manager">
              <TeamCalendarView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/reports"
          element={
            <ProtectedRoute role="manager">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

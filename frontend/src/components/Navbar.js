import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userRole, userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const employeeLinks = [
    { label: 'Dashboard', path: '/employee/dashboard' },
    { label: 'Mark Attendance', path: '/employee/mark-attendance' },
    { label: 'History', path: '/employee/attendance-history' },
    { label: 'Profile', path: '/employee/profile' }
  ];

  const managerLinks = [
    { label: 'Dashboard', path: '/manager/dashboard' },
    { label: 'All Employees', path: '/manager/all-attendance' },
    { label: 'Team Calendar', path: '/manager/team-calendar' },
    { label: 'Reports', path: '/manager/reports' }
  ];

  const navLinks = userRole === 'manager' ? managerLinks : employeeLinks;

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(userRole === 'manager' ? '/manager/dashboard' : '/employee/dashboard')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-blue-600">📋</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white">AttendanceHub</h1>
              <p className="text-xs text-blue-100">Employee Management System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-white hover:text-blue-100 font-semibold transition duration-300 hover:scale-105"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-white font-semibold text-sm">{userName}</p>
              <p className="text-blue-100 text-xs capitalize">{userRole}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg font-bold text-blue-600">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 hover:scale-105"
            >
              Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white text-2xl"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-blue-500 pt-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className="block w-full text-left text-white hover:text-blue-100 font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

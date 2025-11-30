import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAttendance, getAllEmployees } from '../../api/attendanceApi';
import TeamTable from '../../components/manager/TeamTable';
import { exportCSV } from '../../utils/exportCSV';

const AllEmployeesAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceRes, employeesRes] = await Promise.all([
        getAllAttendance(),
        getAllEmployees()
      ]);
      setAttendance(attendanceRes.data || []);
      setFilteredAttendance(attendanceRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters) => {
    let filtered = [...attendance];

    // Filter by Employee ID
    if (newFilters.employeeId) {
      filtered = filtered.filter(item => {
        const user = item.user || item.userId;
        return user?.employeeId?.includes(newFilters.employeeId);
      });
    }

    // Filter by Employee Name
    if (newFilters.employeeName) {
      filtered = filtered.filter(item => {
        const user = item.user || item.userId;
        return user?.name?.toLowerCase().includes(newFilters.employeeName.toLowerCase());
      });
    }

    // Filter by Department
    if (newFilters.department) {
      filtered = filtered.filter(item => {
        const user = item.user || item.userId;
        return user?.department === newFilters.department;
      });
    }

    // Filter by Status
    if (newFilters.status) {
      filtered = filtered.filter(item => item.status === newFilters.status);
    }

    // Filter by Date Range
    if (newFilters.startDate) {
      const startDate = new Date(newFilters.startDate);
      filtered = filtered.filter(item => new Date(item.date) >= startDate);
    }

    if (newFilters.endDate) {
      const endDate = new Date(newFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => new Date(item.date) <= endDate);
    }

    setFilteredAttendance(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      employeeId: '',
      employeeName: '',
      department: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setFilteredAttendance(attendance);
  };

  const handleExport = () => {
    if (filteredAttendance.length === 0) {
      alert('No data to export');
      return;
    }

    const formattedData = filteredAttendance.map(item => {
      // Handle both populated and raw userId structures
      const employeeId = item.userId?.employeeId || item.user?.employeeId || '-';
      const name = item.userId?.name || item.user?.name || '-';
      const department = item.userId?.department || item.user?.department || '-';

      return {
        'Employee ID': employeeId,
        'Employee Name': name,
        'Department': department,
        'Date': item.date ? new Date(item.date).toLocaleDateString() : '-',
        'Check In Time': item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '-',
        'Check Out Time': item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '-',
        'Status': item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Absent',
        'Total Hours': item.totalHours ? item.totalHours.toString() : '0'
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportCSV(formattedData, `attendance_report_${timestamp}.csv`);
  };

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/manager/dashboard')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">All Employees Attendance</h1>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Search & Filter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              placeholder="Search by ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Employee Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Name
            </label>
            <input
              type="text"
              name="employeeName"
              value={filters.employeeName}
              onChange={handleFilterChange}
              placeholder="Search by name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Reset Filters
        </button>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ml-3"
        >
          📥 Export to CSV
        </button>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredAttendance.length}</span> of <span className="font-semibold">{attendance.length}</span> records
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <TeamTable data={filteredAttendance} />
      )}
    </div>
  );
};

export default AllEmployeesAttendance;

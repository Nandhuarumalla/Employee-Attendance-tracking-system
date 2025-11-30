Name:Arumalla Nandini
College Name:Vignan's Lara Institute of Technology and Science
Phone No:7013360967
# Employee-Attendance-tracking-system

A full-stack web application for managing employee attendance, tracking work hours, and generating comprehensive analytics reports. Built with Node.js/Express backend and React frontend with advanced data visualization capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Employee Features
- **Mark Attendance**: Easy check-in/check-out with automatic status detection
- **Attendance Dashboard**: View personal attendance statistics and trends
- **Attendance History**: Detailed records of all attendance with filters
- **Monthly Analytics**: Pie chart visualization of attendance status distribution
- **User Profile**: Personal information display with monthly attendance summary
- **Export**: Download attendance records as CSV

### Manager Features
- **Team Dashboard**: Overview of team attendance with real-time statistics
- **All Employees Attendance**: Comprehensive view of all employee records with filtering
- **Team Calendar View**: Interactive monthly calendar with color-coded attendance status
- **Advanced Reports**: Multiple chart types including:
  - Daily attendance trends (Area Chart)
  - Status distribution (Pie Chart)
  - Department-wise attendance (Bar Chart)
  - Top performers (Horizontal Bar Chart)
- **Data Export**: Export attendance data as CSV for further analysis
- **Employee Management**: View and manage employee records

### General Features
- **Role-Based Access Control**: Separate interfaces for employees and managers
- **JWT Authentication**: Secure token-based authentication
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Gradient backgrounds, smooth animations, and intuitive navigation
- **Real-Time Data**: Live updates of attendance status
- **Data Validation**: Comprehensive input validation on both frontend and backend

## 🛠 Tech Stack

### Frontend
- **React 18+**: Modern UI library with hooks
- **React Router DOM**: Client-side routing
- **Recharts**: Advanced data visualization and charts
- **Tailwind CSS 3.3.3**: Utility-first CSS framework
- **Axios**: HTTP client with JWT interceptor
- **Redux Toolkit**: State management (optional, prepared)

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Cors**: Cross-Origin Resource Sharing
- **Dotenv**: Environment variable management

## 📁 Project Structure

```
employee-attendance-system/
├── backend/
│   ├── app.js                          # Express app configuration
│   ├── server.js                       # Server entry point
│   ├── package.json                    # Backend dependencies
│   ├── config/
│   │   └── db.js                       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js           # Authentication logic
│   │   ├── attendanceController.js     # Attendance operations
│   │   └── dashboardController.js      # Dashboard data
│   ├── middlewares/
│   │   ├── authMiddleware.js           # JWT verification
│   │   ├── errorMiddleware.js          # Error handling
│   │   └── roleMiddleware.js           # Role-based access control
│   ├── models/
│   │   ├── User.js                     # User schema
│   │   └── Attendance.js               # Attendance schema
│   ├── routes/
│   │   ├── authRoutes.js               # Auth endpoints
│   │   ├── attendanceRoutes.js         # Attendance endpoints
│   │   └── dashboardRoutes.js          # Dashboard endpoints
│   ├── validators/
│   │   ├── authValidators.js           # Auth validation
│   │   └── attendanceValidator.js      # Attendance validation
│   └── utils/
│       ├── calculateHours.js           # Hour calculation logic
│       ├── exportCSV.js                # CSV export utility
│       └── generateToken.js            # JWT token generation
│
├── frontend/
│   ├── package.json                    # Frontend dependencies
│   ├── public/
│   │   └── index.html                  # HTML entry point
│   └── src/
│       ├── App.js                      # Main app component
│       ├── index.js                    # React entry point
│       ├── api/
│       │   ├── authApi.js              # Auth API calls
│       │   ├── attendanceApi.js        # Attendance API calls
│       │   └── dashboardApi.js         # Dashboard API calls
│       ├── components/
│       │   ├── Navbar.js               # Navigation component
│       │   ├── employee/
│       │   │   ├── AttendanceCard.js   # Attendance card component
│       │   │   ├── AttendanceTable.js  # Attendance table
│       │   │   └── DashboardStats.js   # Statistics display
│       │   └── manager/
│       │       ├── CalendarView.js     # Calendar component
│       │       ├── DashboardCharts.js  # Dashboard charts
│       │       └── TeamTable.js        # Team data table
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.js            # Login page
│       │   │   └── Register.js         # Registration page
│       │   ├── employee/
│       │   │   ├── Dashboard.js        # Employee dashboard
│       │   │   ├── MarkAttendance.js   # Mark attendance page
│       │   │   ├── AttendanceHistory.js# History page
│       │   │   └── Profile.js          # Profile page
│       │   └── manager/
│       │       ├── Dashboard.js        # Manager dashboard
│       │       ├── AllEmployeesAttendance.js
│       │       ├── TeamCalendarView.js
│       │       └── Reports.js          # Advanced reports
│       ├── routes/
│       │   └── AppRoutes.js            # Route configuration
│       ├── store/
│       │   ├── authSlice.js            # Auth state
│       │   ├── attendanceSlice.js      # Attendance state
│       │   ├── dashboardSlice.js       # Dashboard state
│       │   └── store.js                # Redux store
│       ├── styles/
│       │   ├── global.css              # Global styles
│       │   └── tailwind.css            # Tailwind configuration
│       └── utils/
│           ├── calculateHours.js       # Hour calculation utility
│           ├── exportCSV.js            # CSV export function
│           └── formatDate.js           # Date formatting utility
│
└── README.md                           # This file
```

## 📦 Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **MongoDB**: Local or cloud instance (MongoDB Atlas)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-attendance-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/attendance_system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_system

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Node Environment
NODE_ENV=development

# CORS Settings
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Setup

1. Start MongoDB:
   ```bash
   mongod
   ```

2. The application will automatically create collections on first run

3. (Optional) Seed initial data:
   ```bash
   cd backend
   node scripts/seed.js
   ```

## 🏃 Running the Application

### Terminal 1 - Start Backend Server

```bash
cd backend
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected successfully
```

### Terminal 2 - Start Frontend Development Server

```bash
cd frontend
npm start
```

The application will open automatically at `http://localhost:3000`

### Build for Production

**Backend:**
```bash
cd backend
npm run build
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Attendance
- `GET /api/attendance/my-attendance` - Get user's attendance records
- `POST /api/attendance/mark-attendance` - Mark check-in/check-out
- `GET /api/attendance/all` - Get all attendance (manager only)
- `GET /api/attendance/summary` - Get attendance summary
- `PUT /api/attendance/:id` - Update attendance record (admin)

### Dashboard
- `GET /api/dashboard/employee` - Get employee dashboard data
- `GET /api/dashboard/manager` - Get manager dashboard data
- `GET /api/dashboard/my-summary` - Get personal attendance summary

## 📖 Usage Guide

### For Employees

1. **Register Account**
   - Click "Register" on the login page
   - Fill in required information (name, email, password, department)
   - Submit to create account

2. **Login**
   - Enter email and password
   - Click "Login"
   - Redirected to employee dashboard

3. **Mark Attendance**
   - Navigate to "Mark Attendance" from navbar
   - Click "Check In" when arriving
   - Click "Check Out" when leaving
   - Status automatically calculated (On Time/Late/Half-day/Absent)

4. **View History**
   - Click "Attendance History" in navbar
   - Filter by date range, status, or department
   - View detailed records

5. **View Profile**
   - Click "Profile" in navbar
   - See personal information
   - View monthly attendance pie chart
   - Check attendance statistics (Present, Absent, Late, Half-day)

### For Managers

1. **Manager Dashboard**
   - Overview of team attendance
   - Quick action buttons:
     - **Export Data**: Download attendance as CSV
     - **Reports**: View advanced analytics
     - **Team Calendar**: Interactive monthly calendar
     - **All Employees**: Comprehensive attendance view

2. **View All Employees**
   - Navigate to "All Employees" from navbar
   - Apply filters (Employee ID, Name, Department, Status, Date Range)
   - Export filtered data as CSV
   - Search and sort records

3. **Team Calendar View**
   - See monthly attendance at a glance
   - Color-coded status indicators:
     - 🟢 Green: Present
     - 🔴 Red: Absent
     - 🟡 Yellow: Late
     - 🟠 Orange: Half-day
   - Navigate between months
   - Export calendar data
   - View daily summary statistics

4. **Advanced Reports**
   - **Daily Trend Chart**: Visualize attendance patterns over time
   - **Status Distribution**: See breakdown of all statuses
   - **Department Stats**: Compare attendance by department
   - **Top Employees**: Identify most consistent attendees
   - Filter by date range and employee
   - Export report data



## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String,
  role: String (employee/manager/admin),
  joiningDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (Present/Absent/Late/Half-day),
  totalHours: Number,
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Different access levels for employees and managers
- **Input Validation**: Server-side validation on all inputs
- **CORS Protection**: Cross-origin request restrictions
- **Environment Variables**: Sensitive data not hardcoded

## 🎨 UI/UX Highlights

- **Responsive Design**: Mobile, tablet, and desktop compatible
- **Gradient Backgrounds**: Modern visual design with blue-purple-pink gradients
- **Interactive Charts**: Recharts for dynamic data visualization
- **Smooth Animations**: Hover effects and transitions
- **Color-Coded Status**: Visual indicators for attendance status
- **Professional Navbar**: Sticky navigation with user menu
- **Accessible Layout**: Clear typography and spacing

## 📈 Performance Optimization

- **Lazy Loading**: Routes loaded on demand
- **API Caching**: Reduced unnecessary API calls
- **CSS Minification**: Optimized Tailwind output
- **Image Optimization**: Compressed assets
- **Database Indexing**: MongoDB indexes on frequently queried fields

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For issues, questions, or suggestions:
- Create an issue on the repository
- Contact the development team
- Check existing documentation

## 🎯 Future Enhancements

- [ ] Email notifications for check-in/check-out
- [ ] SMS reminders for attendance
- [ ] Mobile app (React Native)
- [ ] Biometric integration
- [ ] Automated report scheduling
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced analytics with machine learning
- [ ] Integration with payroll system
- [ ] Geolocation-based check-in

---

**Last Updated**: November 30, 2025

**Version**: 1.0.0

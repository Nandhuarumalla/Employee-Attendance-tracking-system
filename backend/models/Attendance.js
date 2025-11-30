const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half-day'],
    default: 'present'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate total hours and auto-detect status
AttendanceSchema.pre('save', function(next) {
  // Calculate total hours if both check-in and check-out exist
  if (this.checkInTime && this.checkOutTime) {
    const diffMs = this.checkOutTime - this.checkInTime;
    this.totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  }

  // Auto-detect status based on check-in/check-out and hours worked
  if (!this.checkInTime && !this.checkOutTime) {
    // No check-in or check-out at all
    this.status = 'absent';
  } else if (this.checkInTime && !this.checkOutTime) {
    // Checked in but not checked out yet (still at office)
    const checkInHour = new Date(this.checkInTime).getHours();
    this.status = checkInHour > 10 ? 'late' : 'present';
  } else if (this.checkInTime && this.checkOutTime) {
    // Both check-in and check-out exist
    const checkInHour = new Date(this.checkInTime).getHours();
    
    // Priority 1: Check total hours worked (less than 4 hours = half-day)
    if (this.totalHours < 4) {
      this.status = 'half-day';
    }
    // Priority 2: Check if arrived late (after 10 AM) but worked full day
    else if (checkInHour > 10) {
      this.status = 'late';
    }
    // Priority 3: Normal presence (on time, worked full day)
    else {
      this.status = 'present';
    }
  }

  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);

const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['check-in', 'check-out', 'mark-present', 'mark-absent', 'mark-late', 'update-record', 'export', 'bulk-update', 'login', 'logout'],
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Create index for efficient queries
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);

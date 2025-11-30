const AuditLog = require('../models/AuditLog');

/**
 * Log an action to audit log
 * @param {string} action - Action type (check-in, check-out, etc.)
 * @param {string} userId - User performing the action
 * @param {object} options - Additional options {details, targetUserId, attendanceId, status, errorMessage, ipAddress, userAgent}
 */
exports.logAction = async (action, userId, options = {}) => {
  try {
    const auditLog = await AuditLog.create({
      action,
      userId,
      details: options.details || '',
      targetUserId: options.targetUserId,
      attendanceId: options.attendanceId,
      status: options.status || 'success',
      errorMessage: options.errorMessage,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent
    });
    return auditLog;
  } catch (err) {
    console.error('Failed to log action:', err);
  }
};

/**
 * Get audit logs with filters
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { userId, action, startDate, endDate, limit = 100, page = 1 } = req.query;
    
    let query = {};
    
    if (userId) query.userId = userId;
    if (action) query.action = action;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email employeeId role')
      .populate('targetUserId', 'name email employeeId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get audit logs for current user
 */
exports.getMyAuditLogs = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const logs = await AuditLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await AuditLog.countDocuments({ userId: req.user._id });

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        page: parseInt(page)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get action statistics
 */
exports.getActionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const stats = await AuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failureCount: {
            $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get logs by specific employee (Manager only)
 */
exports.getEmployeeAuditLogs = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const logs = await AuditLog.find({ userId: employeeId })
      .populate('userId', 'name email employeeId role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await AuditLog.countDocuments({ userId: employeeId });

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        page: parseInt(page)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

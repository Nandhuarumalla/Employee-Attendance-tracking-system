const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const {
  getAuditLogs,
  getMyAuditLogs,
  getActionStats,
  getEmployeeAuditLogs
} = require('../controllers/auditLogController');

const router = express.Router();

// User routes
router.get('/my-logs', protect, getMyAuditLogs);

// Manager routes
router.get('/logs', protect, authorize('manager'), getAuditLogs);
router.get('/stats', protect, authorize('manager'), getActionStats);
router.get('/employee/:employeeId', protect, authorize('manager'), getEmployeeAuditLogs);

module.exports = router;

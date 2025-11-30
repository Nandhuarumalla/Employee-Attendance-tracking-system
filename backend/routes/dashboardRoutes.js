const express = require('express');
const { employeeDashboard, managerDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Employee dashboard
router.get('/employee', protect, authorize('employee'), employeeDashboard);

// Manager dashboard
router.get('/manager', protect, authorize('manager'), managerDashboard);

module.exports = router;

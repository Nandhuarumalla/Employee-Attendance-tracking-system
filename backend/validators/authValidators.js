const { body, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role').isIn(['employee', 'manager']).withMessage('Role must be employee or manager'),
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('department').notEmpty().withMessage('Department is required')
  ];
};

// Validation rules for login
const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ];
};

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerValidationRules, loginValidationRules, validate };

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['employee', 'manager'],
    required: true
  },
  employeeId: {
    type: String,
    unique: true,
    required: [true, 'Employee ID is required']
  },
  department: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: Add a method to check password (bcrypt) if needed
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('User', UserSchema);

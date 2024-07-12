const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  testResults: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' }]
});

module.exports = mongoose.model('User', userSchema);

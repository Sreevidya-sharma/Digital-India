const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  completedModules: {
    type: [String],
    default: []
  },
  quizStatus: {
    type: Map,
    of: String,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

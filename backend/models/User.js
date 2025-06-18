const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,          // optional but recommended so no two users share the same email
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,     // default value instead of “required”
  },
});

module.exports = mongoose.model('User', UserSchema);

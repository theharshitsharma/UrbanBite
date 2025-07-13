const mongoose = require('mongoose');
const { Schema } = mongoose;  // ✅ REQUIRED

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
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.location !== 'Google User';  // ✅ Optional for Google users
    },
  },
  mobile: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);

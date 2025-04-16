const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true, // Enforce unique email
      trim: true,   // Remove whitespace
      lowercase: true
    }, // Store emails in lowercase 
    password: { type: String, required: true },
    account_type: { type: String, enum: ['Freelancer', 'Client'], required: true },
    is_authenticated: { type: Boolean, default: false },

  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  company_name: { type: String, required: true },
  linkedin: { type: String },
  email: { type: String, required: true },
  company_domain: { type: String },
  about_company: { type: String },
  phone_number: { type: String },
  profile_picture: { type: String },
  profile_created: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);

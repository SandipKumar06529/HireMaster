const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    university_name: String,
    degree: String,
    major_of_undergrad: String,
    major_of_grad: String,
    skills: [String],
    resume: String,
    email: { type: String, required: true },
    phone_number: String,
    linkedin: String,
    github: String,
    experience_level: String,
    profile_picture: { type: String },
    profile_created: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Freelancer', FreelancerSchema);

      
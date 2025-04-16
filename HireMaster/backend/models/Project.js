const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    title: { type: String, required: true },
    description: String,
    responsibilities : String,
    requiredSkills: String,
    preferredSkills : String,
    budget: Number,
    deadline: { type: Date },
    project_status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);

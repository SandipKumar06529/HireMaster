const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    title: { type: String, required: true },
    description: String,
    stipend: Number,
    project_level: { type: String, enum: ['Entry', 'Mid', 'Senior'] },
    project_status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);

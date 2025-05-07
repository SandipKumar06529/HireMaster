const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    rating_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },  // ⭐ Added field to store star rating
    feedback: { type: String, required: true, trim: true },
    skill_endorsement: { type: [String], default: [] },
    rating_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);

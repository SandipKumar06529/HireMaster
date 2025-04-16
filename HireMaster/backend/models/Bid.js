const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    proposal: {type: String},
    bid_amount: {type: Number},
    submission_date: { type: Date, default: Date.now },
    bid_status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', BidSchema);

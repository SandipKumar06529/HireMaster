const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        payment_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
        client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
        amount: { type: Number, required: true },
        payment_status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        payment_date_initiated: { type: Date, default: Date.now },
        payment_date_completed: { type: Date, default: null },
    }, 
{ timestamps: true }
); 

module.exports = mongoose.model('Payment', paymentSchema);

// createPayment
// getPayment // change the 9
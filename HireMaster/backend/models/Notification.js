const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
          notification_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          reference_type: { type: String, required: true },
          reference_id: { type: mongoose.Schema.Types.ObjectId, required: true },
          notification_message: { type: String, required: true, trim: true },
          notification_type: { type: String, enum: ['info', 'warning', 'error'], required: true },
          notification_date: { type: Date, default: Date.now },
          notification_status: { type: String, enum: ['unread', 'read', 'dismissed'], default: 'unread' },
          is_action_required: { type: Boolean, default: false },
        }, 
    
        { timestamps: true }
); 

module.exports = mongoose.model('Notification', notificationSchema);


// createNotification
// getnotificationU





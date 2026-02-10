const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    notificationType: {
      type: String,
      enum: ['registration', 'new_event', 'event_reminder', 'event_update'],
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ['email', 'sms', 'calendar', 'in-app'],
      required: true,
    },
    subject: String,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'read'],
      default: 'pending',
    },
    sentAt: Date,
    failureReason: String,
    metadata: {
      calendarEventId: String,
      emailProvider: String,
      smsProvider: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for user notifications
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ status: 1 });

module.exports = mongoose.model('Notification', notificationSchema);

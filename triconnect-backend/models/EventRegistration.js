const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema(
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
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
    calendarEventId: String,
    notificationsSent: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      calendar: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Unique constraint to prevent duplicate registrations
eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);

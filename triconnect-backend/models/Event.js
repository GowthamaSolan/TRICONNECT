const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      enum: ['college', 'industry', 'government'],
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      required: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    organizerDetails: {
      name: String,
      email: String,
      phone: String,
      organization: String,
      logo: String,
    },
    registrationLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'fest',
        'symposium',
        'webinar',
        'workshop',
        'recruitment',
        'tech-summit',
        'public-event',
        'seminar',
        'other',
      ],
      required: true,
    },
    capacity: {
      type: Number,
      default: null,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
eventSchema.index({ sector: 1, eventDate: -1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ title: 'text', description: 'text' });
// Geospatial index for location-based queries
eventSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);

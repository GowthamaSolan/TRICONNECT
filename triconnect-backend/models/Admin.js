const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sector: {
      type: String,
      enum: ['college', 'industry', 'government'],
      required: true,
    },
    organizationName: String,
    organizationEmail: String,
    organizationPhone: String,
    organizationLogo: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDocument: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

adminSchema.index({ sector: 1, verificationStatus: 1 });

module.exports = mongoose.model('Admin', adminSchema);

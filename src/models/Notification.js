import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    type: {
      type: String,
      enum: ['schedule_update', 'ticket_purchase', 'ticket_cancelled', 'general'],
      default: 'general',
    },
    message: String,
    metadata: mongoose.Schema.Types.Mixed,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;


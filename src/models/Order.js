import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    tickets: [
      {
        ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
        type: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending',
    },
    stripePaymentIntentId: String,
    receiptEmail: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;


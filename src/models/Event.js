import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    url: String,
    publicId: String,
  },
  { _id: false }
);

const pricingSchema = new mongoose.Schema(
  {
    tier: {
      type: String,
      enum: ['general', 'vip', 'custom'],
      required: true,
    },
    label: String,
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    benefits: [String],
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      index: true,
    },
    tags: [String],
    startDate: Date,
    endDate: Date,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      isVirtual: {
        type: Boolean,
        default: false,
      },
      meetingUrl: String,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
      default: 'draft',
      index: true,
    },
    capacity: Number,
    pricing: [pricingSchema],
    media: [mediaSchema],
    agenda: [
      {
        time: String,
        title: String,
        speaker: String,
        description: String,
      },
    ],
    analytics: {
      ticketsSold: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
    },
    approvals: {
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
      notes: String,
    },
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', category: 'text' });

const Event = mongoose.model('Event', eventSchema);

export default Event;


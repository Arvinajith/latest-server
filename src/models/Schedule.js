import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: String,
    speaker: String,
    description: String,
    startTime: Date,
    endTime: Date,
    track: String,
    resources: [String],
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      unique: true,
    },
    sessions: [sessionSchema],
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    version: {
      type: Number,
      default: 1,
    },
    notifyAttendees: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;


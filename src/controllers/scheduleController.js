import Schedule from '../models/Schedule.js';
import Event from '../models/Event.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyAttendeesOfScheduleChange } from '../services/notificationService.js';

export const getSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findOne({ event: req.params.eventId });
  if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
  res.json({ schedule });
});

export const upsertSchedule = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  if (!(req.user.role === 'admin' || event.organizer.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const schedule = await Schedule.findOneAndUpdate(
    { event: event._id },
    {
      $set: {
        sessions: req.body.sessions,
        lastUpdatedBy: req.user._id,
        notifyAttendees: req.body.notifyAttendees,
      },
      $inc: { version: 1 },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (req.body.notifyAttendees) {
    await notifyAttendeesOfScheduleChange({
      event: event._id,
      message: 'Event schedule has been updated. Please review the latest agenda.',
    });
  }

  res.json({ schedule });
});


import slugify from 'slugify';

import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiFeatures } from '../utils/apiFeatures.js';

const buildSlug = (title) =>
  slugify(title, {
    lower: true,
    strict: true,
  });

export const getEvents = asyncHandler(async (req, res) => {
  const query = Event.find();
  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['title', 'description', 'category'])
    .sort()
    .paginate(12);

  const events = await features.query.clone();
  const total = await Event.countDocuments(features.query.getFilter());

  res.json({ events, total });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json({ event });
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    organizer: req.user._id,
    slug: req.body.slug || buildSlug(req.body.title),
  };
  const event = await Event.create(payload);
  res.status(201).json({ event });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!(req.user.role === 'admin' || event.organizer.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.body.title && req.body.title !== event.title) {
    req.body.slug = buildSlug(req.body.title);
  }

  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ event: updated });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (!(req.user.role === 'admin' || event.organizer.toString() === req.user._id.toString())) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await event.deleteOne();
  await Ticket.deleteMany({ event: event._id });

  res.json({ message: 'Event deleted' });
});

export const approveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  event.status = req.body.status || 'approved';
  event.approvals = {
    approvedBy: req.user._id,
    approvedAt: new Date(),
    notes: req.body.notes,
  };
  await event.save();
  res.json({ event });
});

export const getEventAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!(isOwner || req.user.role === 'admin')) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const tickets = await Ticket.find({ event: event._id }).populate('user', 'name email role');

  res.json({
    attendees: tickets.map((ticket) => ({
      id: ticket._id,
      name: ticket.user?.name,
      email: ticket.user?.email,
      ticketType: ticket.type,
      status: ticket.status,
      purchasedAt: ticket.createdAt,
    })),
  });
});


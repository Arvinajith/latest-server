import User from '../models/User.js';
import Event from '../models/Event.js';
import Order from '../models/Order.js';
import Ticket from '../models/Ticket.js';
import Feedback from '../models/Feedback.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { exportToCsv } from '../utils/csvExporter.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.json({ user });
});

export const getPendingEvents = asyncHandler(async (_req, res) => {
  const events = await Event.find({ status: 'pending' });
  res.json({ events });
});

export const getTransactions = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('event user').sort('-createdAt');
  res.json({ orders });
});

export const exportAttendees = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ event: req.params.eventId }).populate('user');
  const records = tickets.map((ticket) => ({
    name: ticket.user?.name,
    email: ticket.user?.email,
    ticketType: ticket.type,
    status: ticket.status,
  }));

  const filePath = await exportToCsv({
    records,
    filenamePrefix: 'attendees',
    header: [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'ticketType', title: 'Ticket Type' },
      { id: 'status', title: 'Status' },
    ],
  });

  res.download(filePath, 'attendees.csv');
});

export const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ event: req.params.eventId }).populate('user');
  res.json({ feedback });
});


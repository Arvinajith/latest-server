import Order from '../models/Order.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [revenueAgg, ticketAgg, events, recentOrders, revenueSummary, ticketsCount, eventsCount] =
    await Promise.all([
      Order.aggregate([
        { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalAmount' } } },
        { $sort: { '_id': 1 } },
      ]),
      Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Event.find().select('title analytics startDate status').sort('-createdAt').limit(5),
      Order.find().populate('event user').sort('-createdAt').limit(5),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Ticket.countDocuments(),
      Event.countDocuments(),
    ]);

  res.json({
    revenueTrend: revenueAgg,
    ticketBreakdown: ticketAgg,
    spotlightEvents: events,
    recentOrders,
    totals: {
      revenue: revenueSummary[0]?.total || 0,
      tickets: ticketsCount,
      events: eventsCount,
    },
  });
});


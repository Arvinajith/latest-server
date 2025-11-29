import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createPaymentIntent, refundPayment } from '../services/stripeService.js';
import { sendTicketConfirmation } from '../services/emailService.js';

const computeAmount = (event, ticketPayload) => {
  let total = 0;
  const breakdown = ticketPayload.map((ticket) => {
    const tier = event.pricing.find((price) => price.tier === ticket.type || price.label === ticket.label);
    if (!tier) throw new Error(`Tier not available: ${ticket.type}`);
    const lineAmount = tier.price * ticket.quantity;
    total += lineAmount;
    return {
      ...ticket,
      price: tier.price,
      amount: lineAmount,
    };
  });
  return { total, breakdown };
};

export const initiateCheckout = asyncHandler(async (req, res) => {
  const { eventId, tickets } = req.body;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const { total, breakdown } = computeAmount(event, tickets);
  const paymentIntent = await createPaymentIntent({
    amount: total,
    currency: 'usd',
    metadata: {
      eventId: event._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    breakdown,
    total,
  });
});

export const confirmPurchase = asyncHandler(async (req, res) => {
  const { eventId, tickets, paymentIntentId } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { total, breakdown } = computeAmount(event, tickets);

  const order = await Order.create({
    user: req.user._id,
    event: event._id,
    tickets: breakdown.map((ticket) => ({
      type: ticket.type,
      quantity: ticket.quantity,
      price: ticket.price,
    })),
    totalAmount: total,
    stripePaymentIntentId: paymentIntentId,
    paymentStatus: 'succeeded',
    receiptEmail: req.user.email,
  });

  const ticketDocs = await Promise.all(
    tickets.map((ticket) =>
      Ticket.create({
        event: event._id,
        user: req.user._id,
        order: order._id,
        type: ticket.type,
        price: breakdown.find((line) => line.type === ticket.type)?.price || 0,
        customLabel: ticket.label,
      })
    )
  );

  event.analytics.ticketsSold += tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  event.analytics.revenue += total;
  await event.save();

  await sendTicketConfirmation({
    email: req.user.email,
    event,
    tickets: breakdown,
  });

  res.status(201).json({ order, tickets: ticketDocs });
});

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id }).populate('event');
  res.json({ tickets });
});

export const cancelTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('event');
  if (!ticket || ticket.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  ticket.status = 'cancelled';
  await ticket.save();

  if (ticket.order?.stripePaymentIntentId) {
    await refundPayment({ paymentIntentId: ticket.order.stripePaymentIntentId });
  }

  res.json({ ticket });
});

export const transferTicket = asyncHandler(async (req, res) => {
  const { targetEmail } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket || ticket.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Ticket not found' });
  }

  const newOwner = await User.findOne({ email: targetEmail });
  if (!newOwner) {
    return res.status(404).json({ message: 'Recipient not found' });
  }

  ticket.transferHistory.push({
    from: req.user._id,
    to: newOwner._id,
    transferredAt: new Date(),
  });
  ticket.user = newOwner._id;
  ticket.status = 'transferred';
  await ticket.save();

  res.json({ ticket });
});


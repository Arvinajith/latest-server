import Notification from '../models/Notification.js';
import Ticket from '../models/Ticket.js';
import { sendEmail } from './emailService.js';

export const createNotification = async ({ userId, eventId, type, message, metadata }) => {
  const notification = await Notification.create({
    user: userId,
    event: eventId,
    type,
    message,
    metadata,
  });
  return notification;
};

export const notifyAttendeesOfScheduleChange = async ({ event, message }) => {
  const tickets = await Ticket.find({ event }).populate('user');
  const uniqueUsers = [...new Set(tickets.map((ticket) => ticket.user?._id?.toString()))];

  await Promise.all(
    uniqueUsers.map((userId) =>
      createNotification({
        userId,
        eventId: event,
        type: 'schedule_update',
        message,
      })
    )
  );

  await Promise.all(
    tickets.map((ticket) =>
      sendEmail({
        to: ticket.user?.email,
        subject: 'Event schedule updated',
        html: `<p>${message}</p>`,
      })
    )
  );
};


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER || 'username',
    pass: process.env.SMTP_PASS || 'password',
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!to) return;
  await transporter.sendMail({
    from: process.env.MAIL_FROM || 'events@example.com',
    to,
    subject,
    html,
  });
};

export const sendTicketConfirmation = async ({ email, event, tickets }) => {
  const ticketList = tickets
    .map((ticket) => `<li>${ticket.quantity} x ${ticket.type} - $${ticket.price}</li>`) // simple template
    .join('');
  const html = `<h2>You're in! ${event.title}</h2><p>Order Summary:</p><ul>${ticketList}</ul>`;
  return sendEmail({ to: email, subject: `Your tickets for ${event.title}`, html });
};


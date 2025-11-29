import { stripeClient } from '../config/stripe.js';

export const createPaymentIntent = async ({ amount, currency = 'usd', metadata }) => {
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent;
};

export const refundPayment = async ({ paymentIntentId, amount }) => {
  return stripeClient.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
};


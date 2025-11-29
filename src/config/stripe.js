import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

// Export the Stripe instance as 'stripeClient' to match your import
export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

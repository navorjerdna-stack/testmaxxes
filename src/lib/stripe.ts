import Stripe from 'stripe';

// Validate that Stripe keys are configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_ID;

if (!stripeSecretKey) {
  console.warn('Warning: STRIPE_SECRET_KEY is not configured. Stripe functionality will not work.');
}

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const SUBSCRIPTION_PRICE_ID = stripePriceId || '';

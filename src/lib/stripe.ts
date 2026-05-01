import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Don't throw at import time — let the API route surface a useful error
  // This way the rest of the app builds even without Stripe configured
  console.warn('[lumiere] STRIPE_SECRET_KEY not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia'
});

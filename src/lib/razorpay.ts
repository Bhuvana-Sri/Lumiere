import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID) {
  console.warn('[lumiere] RAZORPAY_KEY_ID not set');
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  console.warn('[lumiere] RAZORPAY_KEY_SECRET not set');
}

export const razorpay = {
  keyId: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
  keySecret: process.env.RAZORPAY_KEY_SECRET ?? 'secret_placeholder',
};

// Helper to verify Razorpay webhook signatures
export function verifyWebhookSignature(
  signature: string,
  body: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return hash === signature;
}

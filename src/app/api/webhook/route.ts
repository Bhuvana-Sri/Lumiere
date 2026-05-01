import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { getAdminSupabase } from '@/lib/supabase';
import { sendBookingConfirmation } from '@/lib/email';

// Stripe webhooks must use the raw request body (not parsed JSON) to verify the signature
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const md = session.metadata ?? {};

    try {
      const supabase = getAdminSupabase();
      const { error } = await supabase.from('bookings').insert({
        treatment_slug: md.treatmentSlug,
        treatment_name: md.treatmentName,
        appointment_at: md.appointmentAt,
        client_name: md.clientName,
        client_email: session.customer_email ?? '',
        client_phone: md.clientPhone,
        notes: md.notes || null,
        deposit_amount_inr: Number(md.depositInr || 500),
        status: 'confirmed',
        stripe_session_id: session.id
      });

      if (error) {
        console.error('[webhook] supabase insert failed', error);
        // Return 500 so Stripe retries
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Best-effort email — don't fail the webhook if email send fails
      try {
        await sendBookingConfirmation({
          to: session.customer_email ?? '',
          clientName: md.clientName,
          treatmentName: md.treatmentName,
          appointmentAt: md.appointmentAt,
          depositAmountInr: Number(md.depositInr || 500)
        });
      } catch (emailErr) {
        console.error('[webhook] email send failed', emailErr);
      }
    } catch (err) {
      console.error('[webhook] handler error', err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Webhook handler error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

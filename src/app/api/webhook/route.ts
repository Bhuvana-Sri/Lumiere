import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, razorpay } from '@/lib/razorpay';
import { getAdminSupabase } from '@/lib/supabase';
import { sendBookingConfirmation } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-razorpay-signature');
  const secret = razorpay.keySecret;

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(signature, rawBody, secret);
    if (!isValid) {
      console.error('[webhook] signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle payment.authorized event (payment successful)
    if (event.event === 'payment.authorized' || event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};

      try {
        const supabase = getAdminSupabase();
        const { error } = await supabase.from('bookings').insert({
          treatment_slug: notes.treatmentSlug,
          treatment_name: notes.treatmentName,
          appointment_at: notes.appointmentAt,
          client_name: notes.clientName,
          client_email: notes.clientEmail,
          client_phone: notes.clientPhone,
          notes: notes.notes || null,
          deposit_amount_inr: Number(notes.depositInr || 500),
          status: 'confirmed',
          razorpay_payment_id: payment.id
        });

        if (error) {
          console.error('[webhook] supabase insert failed', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Best-effort email — don't fail the webhook if email send fails
        try {
          await sendBookingConfirmation({
            to: notes.clientEmail,
            clientName: notes.clientName,
            treatmentName: notes.treatmentName,
            appointmentAt: notes.appointmentAt,
            depositAmountInr: Number(notes.depositInr || 500)
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
  } catch (err) {
    console.error('[webhook] parse error', err);
    return NextResponse.json({ error: 'Webhook parse failed' }, { status: 400 });
  }
}

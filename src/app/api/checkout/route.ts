import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { getTreatment } from '@/lib/treatments';

const bookingSchema = z.object({
  treatmentSlug: z.string().min(1),
  appointmentAt: z.string().datetime(), // ISO
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(7).max(20),
  notes: z.string().max(1000).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    const treatment = getTreatment(data.treatmentSlug);
    if (!treatment) {
      return NextResponse.json({ error: 'Unknown treatment' }, { status: 400 });
    }

    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: data.clientEmail,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${treatment.name} — refundable booking deposit`,
              description: `Deposit for your appointment at Lumière. The deposit is deducted from your final treatment cost.`
            },
            unit_amount: treatment.depositInr * 100 // Stripe expects paise
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?cancelled=1&treatment=${treatment.slug}`,
      // The webhook reads these to create the booking record post-payment
      metadata: {
        treatmentSlug: data.treatmentSlug,
        treatmentName: treatment.name,
        appointmentAt: data.appointmentAt,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        notes: data.notes ?? '',
        depositInr: String(treatment.depositInr)
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[checkout] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', issues: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { razorpay } from '@/lib/razorpay';
import { getTreatment } from '@/lib/treatments';

const bookingSchema = z.object({
  treatmentSlug: z.string().min(1),
  appointmentAt: z.string().datetime(),
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

    if (!razorpay.keyId || razorpay.keyId.includes('placeholder')) {
      console.error('[checkout] Razorpay credentials not configured');
      return NextResponse.json(
        { error: 'Payment not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${razorpay.keyId}:${razorpay.keySecret}`).toString('base64');

    // Create Razorpay order
    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: treatment.depositInr * 100,
        currency: 'INR',
        receipt: `booking-${Date.now()}`,
        notes: {
          treatmentSlug: data.treatmentSlug,
          treatmentName: treatment.name,
          appointmentAt: data.appointmentAt,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone,
          notes: data.notes ?? '',
          depositInr: String(treatment.depositInr)
        }
      })
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error('[checkout] Razorpay error:', error);
      return NextResponse.json(
        { error: error.error?.description || 'Payment initiation failed' },
        { status: 500 }
      );
    }

    const order = await orderResponse.json();
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create subscription for hosted checkout (using Razorpay's payment links or direct checkout)
    // For simplicity, return order details for client-side handling
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: razorpay.keyId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone
    });
  } catch (error) {
    console.error('[checkout] error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    );
  }
}

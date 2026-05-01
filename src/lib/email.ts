import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type BookingConfirmationProps = {
  to: string;
  clientName: string;
  treatmentName: string;
  appointmentAt: string; // ISO
  depositAmountInr: number;
};

export async function sendBookingConfirmation({
  to,
  clientName,
  treatmentName,
  appointmentAt,
  depositAmountInr
}: BookingConfirmationProps) {
  if (!resend) {
    console.warn('[lumiere] Resend not configured — skipping email');
    return { skipped: true };
  }

  const formatted = new Date(appointmentAt).toLocaleString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  const html = `
    <div style="font-family: Georgia, serif; color: #2C2A26; max-width: 560px; margin: 0 auto; padding: 32px;">
      <div style="font-family: Georgia, serif; letter-spacing: 0.32em; font-size: 18px; margin-bottom: 32px;">LUMIÈRE</div>
      <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: normal; line-height: 1.2; margin: 0 0 16px;">
        Your booking is confirmed.
      </h1>
      <p style="font-size: 14px; line-height: 1.7; color: #4A4742; margin: 0 0 24px;">
        Dear ${escapeHtml(clientName)}, thank you for choosing Lumière. Your appointment details are below.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #00000010; color: #6B6760; text-transform: uppercase; letter-spacing: 0.18em; font-size: 11px;">Treatment</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #00000010; text-align: right;">${escapeHtml(treatmentName)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #00000010; color: #6B6760; text-transform: uppercase; letter-spacing: 0.18em; font-size: 11px;">When</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #00000010; text-align: right;">${escapeHtml(formatted)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #6B6760; text-transform: uppercase; letter-spacing: 0.18em; font-size: 11px;">Deposit paid</td>
          <td style="padding: 12px 0; text-align: right;">₹${depositAmountInr.toLocaleString('en-IN')}</td>
        </tr>
      </table>
      <p style="font-size: 13px; line-height: 1.7; color: #4A4742; margin: 0 0 8px;">
        Please arrive 10 minutes early. The deposit will be deducted from your final treatment cost.
      </p>
      <p style="font-size: 13px; line-height: 1.7; color: #4A4742; margin: 0 0 32px;">
        Need to reschedule? Reply to this email or call us at +91 [phone].
      </p>
      <p style="font-style: italic; font-size: 13px; color: #6B6760; border-top: 1px solid #00000010; padding-top: 16px;">
        Lumière · Bengaluru
      </p>
    </div>
  `;

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Lumière <bookings@lumiere.clinic>',
    to,
    subject: `Your Lumière appointment — ${formatted}`,
    html
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

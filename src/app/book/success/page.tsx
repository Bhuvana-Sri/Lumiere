import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { stripe } from '@/lib/stripe';

export const metadata = {
  title: 'Booking confirmed — Lumière'
};

export default async function BookingSuccess({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>> | null = null;
  if (session_id) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch {
      // session_id invalid or Stripe unreachable — show generic success
    }
  }

  const md = session?.metadata ?? {};
  const treatmentName = md.treatmentName as string | undefined;
  const appointmentAt = md.appointmentAt as string | undefined;

  return (
    <>
      <Nav />
      <main className="max-w-[640px] mx-auto px-6 py-20 md:py-32 text-center">
        <div className="smalcap !text-sage-600">Confirmed</div>
        <h1 className="serif-h text-[36px] md:text-[52px] mt-3 mb-6">
          Your appointment <em className="italic text-sage-600">is set.</em>
        </h1>
        <p className="text-[15px] text-charcoal-500 leading-relaxed max-w-[460px] mx-auto mb-10">
          A confirmation has been sent to your email. We look forward to
          welcoming you.
        </p>

        {treatmentName && appointmentAt && (
          <div className="border-t border-b border-charcoal-700/15 py-6 mb-10 text-left max-w-[420px] mx-auto">
            <div className="grid grid-cols-[110px_1fr] gap-3 py-2 text-[14px]">
              <span className="smalcap !text-[10px] pt-1">Treatment</span>
              <span>{treatmentName}</span>
            </div>
            <div className="grid grid-cols-[110px_1fr] gap-3 py-2 text-[14px]">
              <span className="smalcap !text-[10px] pt-1">When</span>
              <span>
                {new Date(appointmentAt).toLocaleString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>
        )}

        <Link href="/" className="link-cta">
          Back to home &nbsp;→
        </Link>
      </main>
      <Footer />
    </>
  );
}

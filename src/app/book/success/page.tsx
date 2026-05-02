import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Booking confirmed — Lumière'
};

export default async function BookingSuccess({
  searchParams
}: {
  searchParams: Promise<{ payment_id?: string; order_id?: string }>;
}) {
  const { payment_id, order_id } = await searchParams;

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

        {payment_id && (
          <div className="border-t border-b border-charcoal-700/15 py-6 mb-10 text-left max-w-[420px] mx-auto">
            <div className="grid grid-cols-[110px_1fr] gap-3 py-2 text-[14px]">
              <span className="smalcap !text-[10px] pt-1">Payment ID</span>
              <span className="text-[12px] font-mono text-charcoal-500">{payment_id}</span>
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

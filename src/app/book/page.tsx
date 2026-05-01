import { Suspense } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { BookingForm } from '@/components/BookingForm';

export const metadata = {
  title: 'Book a consultation — Lumière',
  description: 'Reserve your appointment with a small refundable deposit.'
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="p-12 text-center smalcap">Loading…</div>}>
          <BookingForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

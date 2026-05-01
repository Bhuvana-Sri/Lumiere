import { redirect } from 'next/navigation';
import { isAuthed, clearAdminCookie } from '@/lib/admin-auth';
import { getAdminSupabase, type BookingRow } from '@/lib/supabase';
import { AdminBookings } from '@/components/AdminBookings';

export const metadata = { title: 'Bookings — Lumière admin' };
export const dynamic = 'force-dynamic';

async function logout() {
  'use server';
  await clearAdminCookie();
  redirect('/admin/login');
}

export default async function AdminPage() {
  if (!(await isAuthed())) redirect('/admin/login');

  let bookings: BookingRow[] = [];
  let loadError: string | null = null;

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('appointment_at', { ascending: true });
    if (error) throw error;
    bookings = (data ?? []) as BookingRow[];
  } catch (err) {
    loadError =
      err instanceof Error
        ? err.message
        : 'Could not load bookings — check Supabase configuration';
  }

  return (
    <main className="min-h-screen bg-cream-50 px-6 md:px-10 py-10">
      <header className="flex items-center justify-between mb-10">
        <div className="font-serif text-[16px] tracking-editorial">LUMIÈRE</div>
        <form action={logout}>
          <button
            type="submit"
            className="text-[11px] tracking-widest uppercase text-charcoal-500 hover:text-charcoal-700 transition-colors"
          >
            Sign out
          </button>
        </form>
      </header>

      <h1 className="serif-h text-[36px] md:text-[44px] mb-8">Bookings.</h1>

      {loadError ? (
        <div className="border border-red-300 bg-red-50 text-red-700 p-4 text-[13px]">
          {loadError}
        </div>
      ) : (
        <AdminBookings initial={bookings} />
      )}
    </main>
  );
}

'use client';

import { useState, useTransition } from 'react';
import type { BookingRow } from '@/lib/supabase';

const statusOptions: BookingRow['status'][] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled'
];

const statusColor: Record<BookingRow['status'], string> = {
  pending: 'bg-cream-200 text-charcoal-500',
  confirmed: 'bg-sage-50 text-sage-700',
  completed: 'bg-charcoal-700 text-cream-100',
  cancelled: 'bg-red-50 text-red-700'
};

export function AdminBookings({ initial }: { initial: BookingRow[] }) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState<'all' | BookingRow['status']>('all');
  const [pending, startTransition] = useTransition();

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter);

  async function updateStatus(id: string, status: BookingRow['status']) {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    startTransition(async () => {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) {
        // Revert on failure
        const original = initial.find((b) => b.id === id);
        if (original) {
          setBookings((bs) =>
            bs.map((b) => (b.id === id ? original : b))
          );
        }
        alert('Failed to update — please refresh');
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['all', ...statusOptions] as const).map((s) => {
          const count =
            s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[11px] tracking-widest uppercase font-medium px-3 py-1.5 border transition-colors ${
                filter === s
                  ? 'border-charcoal-700 bg-charcoal-700 text-cream-100'
                  : 'border-charcoal-700/15 hover:border-charcoal-700/40'
              }`}
            >
              {s} <span className="opacity-60 ml-1">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-charcoal-400 text-[14px] py-12 text-center">
          No bookings to show.
        </p>
      ) : (
        <div className="bg-white border border-charcoal-700/10 overflow-x-auto">
          <table className="w-full text-[13px] min-w-[760px]">
            <thead>
              <tr className="border-b border-charcoal-700/10 text-left">
                {['When', 'Treatment', 'Client', 'Contact', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="smalcap !text-[10px] py-3 px-4 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-charcoal-700/5 last:border-b-0">
                  <td className="py-4 px-4 align-top">
                    <div className="font-medium">
                      {new Date(b.appointment_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="text-charcoal-400 text-[11px]">
                      {new Date(b.appointment_at).toLocaleTimeString('en-IN', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top">{b.treatment_name}</td>
                  <td className="py-4 px-4 align-top">
                    {b.client_name}
                    {b.notes && (
                      <div className="text-charcoal-400 text-[11px] mt-1 italic">
                        {b.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top text-[12px]">
                    <a
                      href={`mailto:${b.client_email}`}
                      className="block hover:text-sage-600"
                    >
                      {b.client_email}
                    </a>
                    <a
                      href={`tel:${b.client_phone}`}
                      className="block text-charcoal-400 hover:text-sage-600"
                    >
                      {b.client_phone}
                    </a>
                  </td>
                  <td className="py-4 px-4 align-top">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as BookingRow['status'])}
                      disabled={pending}
                      className={`text-[10px] tracking-widest uppercase font-medium px-2 py-1 border-0 cursor-pointer ${statusColor[b.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

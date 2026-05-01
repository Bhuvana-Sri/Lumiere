import { createClient } from '@supabase/supabase-js';

// Server-side admin client — uses service role key, bypasses RLS.
// NEVER import this in client components.
export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}

export type BookingRow = {
  id: string;
  created_at: string;
  treatment_slug: string;
  treatment_name: string;
  appointment_at: string; // ISO
  client_name: string;
  client_email: string;
  client_phone: string;
  notes: string | null;
  deposit_amount_inr: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  stripe_session_id: string | null;
};

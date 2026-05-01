-- Lumière clinic — bookings schema
-- Run this once in Supabase: SQL Editor → New query → paste → Run

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  treatment_slug text not null,
  treatment_name text not null,
  appointment_at timestamptz not null,

  client_name text not null,
  client_email text not null,
  client_phone text not null,
  notes text,

  deposit_amount_inr integer not null default 500,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),

  stripe_session_id text unique
);

create index if not exists bookings_appointment_at_idx
  on public.bookings (appointment_at);

create index if not exists bookings_status_idx
  on public.bookings (status);

-- Row Level Security: writes happen only via the service role key from the
-- Stripe webhook and the admin API route. We disable public access entirely.
alter table public.bookings enable row level security;

-- (No policies created → no anon/authenticated access. Service role bypasses RLS.)

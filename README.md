# Lumière — Booking + Payment Platform

A website I comissioned for a friend planning to start a clinic. It's a full-stack SaaS booking and payment platform for appointment-based services. Features a public booking interface, admin dashboard, payment processing, and email confirmations.

## Features

- **Multi-step booking form** with calendar date picker and time slots
- **Payment processing** via [Razorpay](https://razorpay.com/) (supports UPI, cards, netbanking). Suceesful bookings are written to [Supabase](https://supabase.com/)
- **Admin dashboard** with password-protected booking management  
  **Transactional emails** for payment confirmations with [Resend](https://resend.com/) integration
- **Fully responsive** design with smooth scroll animations
- **Before/after image slider** with drag, touch, and keyboard support

## Tech Stack

**Frontend:**

- Next.js 15 (App Router) + TypeScript
- React 18 + Tailwind CSS
- Framer Motion (animations & scroll reveals)

**Backend:**

- Next.js API Routes (serverless)
- PostgreSQL (Supabase)
- Cookie-based admin authentication

**Integrations:**

- **[Razorpay](https://razorpay.com/)** – Payment gateway (India-focused, supports UPI)
- **[Supabase](https://supabase.com/)** – Database & server-side client
- **[Resend](https://resend.com/)** – Transactional emails
- **[Vercel](https://vercel.com/)** – Hosting & deployment

## Architecture

```
┌─────────────┐
│   Client    │─── /book (booking form)
└─────────────┘      │
                     ▼
           ┌──────────────────┐
           │  /api/checkout   │─ creates Razorpay order
           └──────────────────┘
                     │
                     ▼ (payment → webhook)
           ┌──────────────────┐
           │  /api/webhook    │
           └──────────────────┘
              │              │
              ▼              ▼
         [Supabase]    [Resend email]
         (save booking) (confirmation)
                     │
                     ▼
         ┌──────────────────────┐
         │  /admin (protected)  │
         │  booking dashboard   │
         └──────────────────────┘
```

**Key design decisions:**

- Booking only persisted **after payment confirmation** (no invalid data)
- Webhooks signed and verified server-side (secure)
- Service role key never exposed to client (secure database access)
- Multi-step form with client-side validation + server-side parsing (UX + safety)

## Key Features

### 1. Payment Flow

- Multi-vendor support ready (Razorpay, Stripe-compatible)
- HMAC webhook signature verification
- Idempotent booking creation (safe retries)
- Test mode by default

### 2. Admin Dashboard

- Password-protected with secure sessions
- View all bookings with filtering/sorting
- Update booking status (pending → confirmed → completed)
- Real-time data from Supabase

### 3. Email Confirmations

- Branded HTML emails via Resend
- Contains appointment details & payment info
- Automated on payment confirmation (webhook)

### 4. Responsive Design

- Mobile-first Tailwind CSS
- Smooth scroll animations (Framer Motion)
- Touch-friendly date picker & time selection
- Accessible (keyboard navigation, reduced-motion support)

## Performance

- **Next.js optimizations:** Image optimization, code splitting, ISR
- **Tailwind:** Minimal CSS footprint (~15KB gzipped)
- **Vercel:** Edge-optimized deployments, automatic CDN
- **Database:** Supabase with indexed queries
